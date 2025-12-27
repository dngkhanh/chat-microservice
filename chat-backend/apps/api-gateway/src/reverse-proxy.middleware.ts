import {
  createProxyMiddleware,
  RequestHandler,
  Options,
} from 'http-proxy-middleware';
import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const logger = new Logger('ReverseProxy');

export function createReverseProxyMiddleware(
  path: string,
  target: string,
): RequestHandler<any, any> {
  const options: Options<any, any> = {
    target,
    changeOrigin: true,
    pathRewrite: (reqPath: string, _req: any) => {
      // Express strips the prefix before passing to middleware
      return path + reqPath;
    },
    ws: false, // WebSocket handled separately
    on: {
      proxyReq: (proxyReq, req: any) => {
        // Forward trace-id and user info from gateway to downstream
        if (req.id) {
          proxyReq.setHeader('x-trace-id', req.id as string);
        }
        if (req.user) {
          proxyReq.setHeader('x-user-id', req.user.sub as string);
          proxyReq.setHeader(
            'x-user-roles',
            JSON.stringify(req.user.roles || []),
          );
        }

        // IMPORTANT: Forward cookies to downstream services
        // This is required for HttpOnly cookie authentication
        if (req.headers.cookie) {
          proxyReq.setHeader('cookie', req.headers.cookie as string);
        }

        console.log(
          `[ReverseProxy] [${req.id}] Proxy ${req.method} ${req.originalUrl} → ${target}${path}${req.path}`,
        );
      },
      proxyRes: (proxyRes, req: any) => {
        proxyRes.headers['x-trace-id'] = req.id;
        console.log(
          `[ReverseProxy] [${req.id}] Response status: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`,
        );
      },
      error: (err, req: any, res) => {
        console.error(
          `[ReverseProxy] [${req.id}] Proxy error: ${err.message}`,
          err,
        );
        logger.error(`[${req.id}] Proxy error: ${err.message}`);
        res.status(502).json({
          statusCode: 502,
          message: 'Bad Gateway',
          detail: 'Gateway failed to reach downstream service',
          timestamp: new Date().toISOString(),
        });
      },
    },
  };

  return createProxyMiddleware(options);
}

export function createWebSocketProxyMiddleware(
  path: string,
  target: string,
): RequestHandler<any, any> {
  const options: Options<any, any> = {
    target,
    changeOrigin: true,
    ws: true, // enable WebSocket
    pathRewrite: (reqPath: string) => reqPath,
    on: {
      proxyReq: (proxyReq, req: any) => {
        if (req.id) {
          proxyReq.setHeader('x-trace-id', req.id as string);
        }
        if (req.user) {
          proxyReq.setHeader('x-user-id', req.user.sub as string);
        }
        logger.debug(`[${req.id}] WebSocket upgrade ${req.url} → ${target}`);
      },
      error: (err, req: any) => {
        logger.error(`[${req.id}] WS proxy error: ${err.message}`);
      },
    },
  };

  return createProxyMiddleware(options);
}

export function createNamespaceAwareWebSocketMiddleware(
  chatServiceUrl: string,
  notificationServiceUrl: string,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    // Detect namespace from query parameters
    // Socket.IO sends namespace in query: ?EIO=4&transport=websocket&namespaces=%2Fnotifications
    // or for chat (default): ?EIO=4&transport=websocket
    const url = req.url;
    const namespaceMatch = url.match(/namespaces=([^&]*)/);
    const namespace = namespaceMatch
      ? decodeURIComponent(namespaceMatch[1])
      : '/chat';

    // Determine target service based on namespace
    const target =
      namespace === '/notifications' ? notificationServiceUrl : chatServiceUrl;

    logger.debug(
      `[${(req as any).id}] WebSocket namespace detected: "${namespace}", routing to ${target}`,
    );

    // Create proxy for this request
    const options: Options<any, any> = {
      target,
      changeOrigin: true,
      ws: true,
      pathRewrite: (reqPath: string) => reqPath,
      on: {
        proxyReq: (proxyReq, req: any) => {
          if (req.id) {
            proxyReq.setHeader('x-trace-id', req.id as string);
          }
          if (req.user) {
            proxyReq.setHeader('x-user-id', req.user.sub as string);
          }
          logger.debug(
            `[${req.id}] WebSocket upgrade ${req.url} → ${target} (namespace: ${namespace})`,
          );
        },
        error: (err, req: any) => {
          logger.error(`[${req.id}] WS proxy error: ${err.message}`);
        },
      },
    };

    const proxy = createProxyMiddleware(options);
    void proxy(req, res, next);
  };
}
