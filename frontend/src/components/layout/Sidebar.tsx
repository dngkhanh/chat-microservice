import { NavLink, useLocation } from 'react-router-dom'
import { MessageSquare, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import ConversationList from '@/components/chat/ConversationList'

export default function Sidebar() {
  const location = useLocation()
  const isOnChatPage = location.pathname === '/'

  return (
    <aside className="w-80 bg-card border-r border-border flex flex-col">
      {/* Navigation Menu */}
      <nav className="p-2 border-b border-border">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent text-foreground'
            )
          }
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">Hội thoại</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent text-foreground'
            )
          }
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Người dùng</span>
        </NavLink>
      </nav>

      {/* Conversation List - only show on chat page */}
      {isOnChatPage ? (
        <ConversationList />
      ) : (
        <div className="flex-1" />
      )}
    </aside>
  )
}
