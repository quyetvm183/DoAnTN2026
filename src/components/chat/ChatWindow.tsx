// src/components/chat/ChatWindow.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'

type Message = {
    id: string
    content: string
    senderId: string
    senderName: string
    sentAt: string
    isRead: boolean
}

type ChatWindowProps = {
    bookingId: string
    otherUser: {
        id: string
        name: string
        avatarUrl?: string
    }
    isOpen: boolean
    onClose: () => void
}

export default function ChatWindow({ bookingId, otherUser, isOpen, onClose }: ChatWindowProps) {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (isOpen) {
            loadMessages()
            // Setup real-time updates here (WebSocket/SSE)
        }
    }, [isOpen, bookingId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const loadMessages = async () => {
        try {
            const response = await fetch(`/api/bookings/${bookingId}/messages`)
            if (response.ok) {
                const data = await response.json()
                setMessages(data.messages)
            }
        } catch (error) {
            console.error('Failed to load messages:', error)
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim() || isLoading) return

        setIsLoading(true)
        try {
            const response = await fetch(`/api/bookings/${bookingId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newMessage,
                    receiverId: otherUser.id
                })
            })

            if (response.ok) {
                const message = await response.json()
                setMessages(prev => [...prev, message])
                setNewMessage('')
                // Auto-resize textarea
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto'
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value)
        // Auto-resize
        const textarea = e.target
        textarea.style.height = 'auto'
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:items-center md:justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Chat Window */}
            <div className="relative w-full max-w-md h-[600px] bg-white rounded-2xl shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                            {otherUser.avatarUrl ? (
                                <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <span className="text-white text-sm font-medium">
                                    {otherUser.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
                            <p className="text-xs text-emerald-600">Online</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                        const isOwn = message.senderId === session?.user.id
                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                    <div
                                        className={`px-4 py-2 rounded-2xl ${isOwn
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 px-2">
                                        {new Date(message.sentAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-end gap-2">
                        <textarea
                            ref={textareaRef}
                            value={newMessage}
                            onChange={handleTextareaResize}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            style={{ minHeight: '44px', maxHeight: '120px' }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || isLoading}
                            className="flex items-center justify-center w-11 h-11 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

