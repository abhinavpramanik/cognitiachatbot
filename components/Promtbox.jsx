import React, { useState } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Promtbox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompt] = useState("");
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    const promptCopy = prompt;

    try {
      if (!user) {
        toast.error('Login to send message');
        return;
      }
      if (isLoading) {
        toast.error('Wait for the previous prompt response');
        return;
      }

      setIsLoading(true);
      setPrompt("");

      const userPrompt = {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      };

      // guard: selectedChat must exist before we read selectedChat._id
      if (!selectedChat || !selectedChat._id) {
        toast.error('Please select a chat first');
        setPrompt(promptCopy);
        setIsLoading(false);
        return;
      }

      // update chats immutably
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id ? { ...chat, messages: [...(chat.messages || []), userPrompt] } : chat
        )
      );

      // update selected chat
      setSelectedChat((prev) => ({ ...prev, messages: [...(prev?.messages || []), userPrompt] }));

      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt
      });

      if (data?.success) {
        // backend returns the updated chat in data.data
        const updatedChat = data.data;
        // update chats list
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id ? { ...chat, messages: updatedChat.messages } : chat
          )
        );

        // find assistant's full message
        const assistantFull = updatedChat.messages.slice().reverse().find(m => m.role === 'assistant')?.content || '';

        // insert a blank assistant message and animate
        let assistantMessage = {
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        };

        setSelectedChat((prev) => ({ ...prev, messages: [...(prev?.messages || []), assistantMessage] }));

        const messageTokens = assistantFull.split(' ');
        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            const content = messageTokens.slice(0, i + 1).join(' ');
            setSelectedChat((prev) => {
              const msgs = [...prev.messages];
              msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
              return { ...prev, messages: msgs };
            });
          }, i * 50);
        }
      } else {
        toast.error(data?.message || 'AI error');
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={sendPrompt}
    className={`w-full ${selectedChat?.messages.length>0 ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
      <textarea
        onKeyDown={handleKeyDown}
        className='outline-none w-full resize-none overflow-hidden break-words bg-transparent'
        rows={2}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='Message Congintia.' required
      />

      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center gap-2'>
          <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
            <Image src={assets.deepthink_icon} className='h-5' alt=''/>
            Gemini 2.5 flash
          </p>

          <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
            <Image src={assets.search_icon} className='h-5' alt=''/>
            Search
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Image src={assets.pin_icon} className='w-4 cursor-pointer' alt=''/>
          <button className={`${prompt ? "bg-primary":"bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
            <Image src={prompt ? assets.arrow_icon: assets.arrow_icon_dull} className='w-3.5 aspect-square cursor-pointer' alt=''/>
          </button>    
        </div>
      </div>
    </form>
  )
}

export default Promtbox
