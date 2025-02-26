import React, { useEffect, useRef, useState } from 'react'
import { MdAttachFile, MdSend } from 'react-icons/md'
import useChatContext from '../context/ChatContext.jsx'
import { useNavigate } from 'react-router'
import SockJS from 'sockjs-client'
import { baseURL } from '../config/AxiosHelper.js'
import { Stomp } from '@stomp/stompjs'
import toast from 'react-hot-toast'
import { getMessages } from '../services/RoomService.js'
import Logo from '../assets/Logo.png'
import { timeAgo } from '../config/helper.js'
import { motion } from 'framer-motion'
import { Smile } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'

const ChatPage = () => {
  const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatBoxRef = useRef(null)
  const [stompClient, setStompClient] = useState(null)
  const autoScroll = useRef(true)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  // Connection check
  useEffect(() => {
    if (!connected) navigate('/')
  }, [connected, navigate])

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getMessages(roomId)
        setMessages(data)
      } catch (error) {
        toast.error('Failed to load messages')
      }
    }
    loadMessages()
  }, [roomId])

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (!chatBoxRef.current) return
      
      const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100
      autoScroll.current = isNearBottom
    }

    const container = chatBoxRef.current
    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-scroll logic
  useEffect(() => {
    if (autoScroll.current && chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`)
      const client = Stomp.over(sock)

      client.connect({}, () => {
        setStompClient(client)
        toast.success('Connected to chat!')
        
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = { 
            ...JSON.parse(message.body),
            id: Date.now(),
            animate: true 
          }
          setMessages(prev => [...prev, newMessage])
        })
      })

      return () => client?.disconnect()
    }

    connectWebSocket()
    return () => stompClient?.disconnect()
  }, [roomId])

  const sendMessage = () => {
    if (!stompClient || !input.trim()) return

    const message = {
      sender: currentUser,
      content: input,
      roomId: roomId
    }

    stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message))
    setInput('')
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Implement your file upload logic here
      console.log('Selected file:', file)
      // Example: uploadFile(file).then(...)
    }
  }

  const handleEmojiSelect = (emoji) => {
    setInput(prev => prev + emoji.emoji)
    setIsEmojiPickerOpen(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateX: '100%' }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: '-100%' }}
      transition={{ 
        type: 'spring',
        stiffness: 200,
        damping: 25,
        mass: 0.5
      }}
      className="absolute inset-0"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className='dark:bg-gray-800 h-screen'>
        <header className='flex justify-between items-center p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm relative'>
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <h1 className='text-lg font-semibold text-gray-700 dark:text-gray-200'>
                Room: <span className='text-purple-600 dark:text-purple-400'>{roomId}</span>
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Logged in as <span className='font-medium text-emerald-600 dark:text-emerald-400'>{currentUser}</span>
              </p>
            </div>
          </div>

          <div className='absolute left-1/2 -translate-x-1/2 z-10'>
            <img 
              src={Logo} 
              className='w-16 h-16 object-contain shadow-lg'
              alt="Chat App Logo"
            />
          </div>

          <button 
            className='px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg 
                      hover:from-purple-950 hover:to-red-800 transition-all duration-300 shadow-lg hover:animate-shake'
            onClick={() => {
              setConnected(false)
              navigate('/')
            }}
          >
            Leave Room
          </button>
        </header>

        <main
          ref={chatBoxRef}
          className='w-2/3 mx-auto p-4 overflow-auto h-[calc(100vh-160px)] bg-white dark:bg-gray-700 shadow-sm space-y-1 relative'
        >
          {/* Combined Logo and Text */}
          <div className='fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-0'>
            {/* Logo with heartbeat animation */}
            <img 
              src={Logo} 
              alt="ChatSphere Logo" 
              className='w-24 h-24 object-contain opacity-20 ' 
            />
            
            {/* Text */}
            <span className='text-[5rem] font-bold opacity-20 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent select-none'>
              ChatSphere
            </span>
          </div>

          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] flex gap-3 ${message.sender === currentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <img 
                  className={`h-8 w-8 rounded-full border-2 border-white dark:border-gray-700 
                            transition-transform hover:scale-110 cursor-pointer ${
                              message.sender === currentUser ? 'ml-2' : 'mr-2'
                            }`}
                  src={message.sender === currentUser ? 
                    'https://avatar.iran.liara.run/public/36' : 
                    'https://avatar.iran.liara.run/public/31'} 
                  alt='avatar'
                />
                <div className={`relative p-3 rounded-2xl shadow-lg message-bubble ${
                  message.sender === currentUser 
                    ? 'bg-gradient-to-br from-green-600 to-blue-600 text-white' 
                    : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white '
                }`}>
                  <div className='flex items-center gap-4 mb-1'>
                    <span className={`text-xs font-semibold ${
                      message.sender === currentUser ? 
                      'text-purple-100' : 
                      'text-purple-600 dark:text-purple-300'
                    }`}>
                      {message.sender === currentUser ? 'You' : message.sender}
                    </span>
                    <span className='text-xs text-gray-400 opacity-0 animate-fade-in delay-100'>
                      {timeAgo(message.timeStamp)}
                    </span>
                  </div>
                  <p className={`text-sm ${message.sender === currentUser ? 'text-gray-100' : 'text-gray-800 dark:text-gray-200'}`}>
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </main>

        <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700'>
          <div className='max-w-4xl mx-auto p-3 flex gap-2'>
            <button
              className='px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400
                       rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors'
              onClick={() => document.getElementById('fileInput').click()}
            >
              <MdAttachFile className='w-5 h-5' />
            </button>

            <div className='relative'>
              <button
                type='button'
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                className='px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400
                         rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors'
              >
                <Smile className='w-5 h-5' />
              </button>
              
              {isEmojiPickerOpen && (
                <div className='absolute bottom-full mb-2 z-50'>
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    skinTonesDisabled
                    searchDisabled
                    previewConfig={{ showPreview: false }}
                    theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                  />
                </div>
              )}
            </div>

            <input
              className='flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500
                       transition-all duration-200 shadow-sm text-sm'
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder='Type your message...'
            />
            <button
              onClick={sendMessage}
              className='px-5 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors
                       duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95 text-sm'
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatPage