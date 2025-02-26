import React from 'react'
import Logo from '../assets/Logo.png'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createRoomApi } from '../services/RoomService.js'
import useChatContext from '../context/ChatContext.jsx';
import { useNavigate } from 'react-router'
import { joinChatApi } from '../services/RoomService.js'
import '../index.css'
import { motion } from 'framer-motion'



const JoinCreateChat = () => {
  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  const [detail, setDetail] = useState({
    roomId: '',
    userName: '',
  });

  function handleFormInputChange(event) {
    // Correctly update state by spreading previous values
    setDetail(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error(
        <div className='flex items-center gap-2'>
          Please fill all the fields 
          <span className='text-3xl'>😡</span>
        </div>
      );
      return false;
    }
    return true;
  }

  async function handlejoinChat() {
    if (!validateForm()) return;

    try {
      const room = await joinChatApi(detail.roomId);
      toast.success(<div className='flex items-center gap-2'>
         Room joined successfully 
        <span className='text-3xl'>😉</span>
      </div>
    );;
      // Set context values before navigation
      setRoomId(detail.roomId);
      setCurrentUser(detail.userName);
      setConnected(true);
      navigate('/chat');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Room not found';
      toast.error(message);
    }
  }

  async function createRoom() {
    if (!validateForm()) return;

    try {
      const response = await createRoomApi(detail.roomId);
      toast.success("Room created successfully :)");
      // Set context values before navigation
      setRoomId(response.roomId);
      setCurrentUser(detail.userName);
      setConnected(true);
      navigate('/chat');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Failed to create room';
      toast.error(message);
    }
  }

  return (
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3 }}
      className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 absolute inset-0'
    >
      <div className='p-8 border dark:border-gray-700 w-full flex flex-col gap-6 max-w-md rounded-2xl bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm shadow-2xl'>
        <div className='flex justify-center mb-6'>
          <img 
            src={Logo} 
            className='w-32 h-32 object-contain drop-shadow-[0_4px_12px_rgba(147,51,234,0.3)] dark:drop-shadow-[0_4px_12px_rgba(147,51,234,0.5)] logo-animation' 
            alt="Chat App Logo"
          />
        </div>

        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-gradient-shift">
          ChatSphere
        </h1>

        {/* Input Fields */}
        <div className='space-y-6'>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Your Name
            </label>
            <input
              className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500
                       transition-all duration-200 shadow-sm'
              type="text"
              onChange={handleFormInputChange}
              value={detail.userName}
              id="name"
              name="userName"
              placeholder='Enter your name'
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Room ID/ New RoomId
            </label>
            <input
              className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500
                       transition-all duration-200 shadow-sm'
              type="text"
              name='roomId'
              onChange={handleFormInputChange}
              value={detail.roomId}
              id="roomId"
              placeholder='Enter room id'
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col gap-3'>
          <button
            onClick={handlejoinChat}
            className='w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-600 dark:to-blue-500 text-white rounded-xl
                     hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2  '
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className='w-full px-6 py-3.5 bg-gradient-to-r from-pink-500 to-orange-400 dark:from-pink-600 dark:to-orange-500 text-white rounded-xl
                     hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold
                     focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
          >
            Create New Room
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default JoinCreateChat