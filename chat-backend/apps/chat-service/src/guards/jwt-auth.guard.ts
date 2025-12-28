import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip if route is marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'supersecret_access',
      });

      // Attach user to request
      (request as Record<string, unknown>).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: Record<string, unknown>): string | undefined {
    // Try to extract from Authorization header first
    const authorization = (request.headers as Record<string, unknown>)
      ?.authorization as string | undefined;
    if (authorization) {
      const [type, token] = authorization.split(' ');
      if (type === 'Bearer' && token) return token;
    }

    // Fallback to cookie (httpOnly cookie)
    const cookieToken = (request.cookies as Record<string, unknown>)
      ?.accessToken as string | undefined;
    if (cookieToken) return cookieToken;

    return undefined;
  }
}
