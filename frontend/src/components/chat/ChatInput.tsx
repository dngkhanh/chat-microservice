import { useState, FormEvent } from 'react'
import { Send } from 'lucide-react'
import { chatService } from '@/services/chatService'
import { useChatStore } from '@/store/chatStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ChatInput() {
  const { selectedConversation, addMessage, updateConversationLastMessage } = useChatStore()
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !selectedConversation || isSending) return

    setIsSending(true)
    try {
      const sentMessage = await chatService.sendMessage({
        conversationId: selectedConversation.id,
        content: message.trim(),
      })

      // Add message to store (WebSocket will also send it, but this is for optimistic UI)
      addMessage(sentMessage)
      updateConversationLastMessage(selectedConversation.id, sentMessage)

      // Clear input
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="p-4 bg-card border-t border-border">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSending}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!message.trim() || isSending}
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSending ? 'Đang gửi...' : 'Gửi'}
        </Button>
      </form>
    </div>
  )
}
