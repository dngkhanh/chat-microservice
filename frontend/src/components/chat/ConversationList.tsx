import { useEffect, useState } from 'react'
import { Search, Plus, Loader2 } from 'lucide-react'
import { chatService } from '@/services/chatService'
import type { Conversation } from '@/services/chatService'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import CreateConversationModal from '@/components/chat/CreateConversationModal'

export default function ConversationList() {
  const { user } = useAuthStore()
  const { conversations, setConversations, selectConversation, selectedConversation } = useChatStore()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      const data = await chatService.getConversations()
      setConversations(data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase()

    // Search by conversation name
    if (conv.name && conv.name.toLowerCase().includes(searchLower)) {
      return true
    }

    // Search by participant names
    return conv.participants.some(
      (p) => p.name.toLowerCase().includes(searchLower) || p.email.toLowerCase().includes(searchLower)
    )
  })

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name

    // For non-group conversations, show other participant's name
    const otherParticipant = conversation.participants.find((p) => p.id !== user?.id)
    return otherParticipant?.name || 'Unknown'
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 1) return 'Vừa xong'
    if (diffInMins < 60) return `${diffInMins} phút`
    if (diffInHours < 24) return `${diffInHours} giờ`
    if (diffInDays < 7) return `${diffInDays} ngày`

    return date.toLocaleDateString('vi-VN')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm hội thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3"
          />
        </div>
      </div>

      {/* Create conversation button */}
      <div className="p-3 border-b border-border">
        <Button className="w-full" size="sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo hội thoại mới
        </Button>
      </div>

      {/* Create conversation modal */}
      <CreateConversationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {searchQuery ? 'Không tìm thấy hội thoại' : 'Chưa có hội thoại nào'}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => selectConversation(conversation)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-colors border-b border-border text-left ${
                selectedConversation?.id === conversation.id ? 'bg-accent' : ''
              }`}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-primary">
                  {getConversationName(conversation)[0].toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-medium text-sm truncate">
                    {getConversationName(conversation)}
                  </h3>
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {formatTime(conversation.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                {conversation.lastMessage ? (
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage.sender.name}:{' '}
                    {conversation.lastMessage.content}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Chưa có tin nhắn
                  </p>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
