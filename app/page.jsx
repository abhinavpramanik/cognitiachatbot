"use client";
import { assets } from "@/assets/assets";
import Sidebar from "@/components/Sidebar";
import Promtbox from "@/components/Promtbox";
import Message from "@/components/Message";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [expand,setExpand] = useState(false)
  const [messages,setMessages] = useState([])
  const [isLoading,setIsLoading] = useState(false)

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand}/>
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image onClick={()=>(expand ? setExpand(false): setExpand(true))}
            className="rotate-180" src={assets.menu_icon} alt="" />
            <Image className="" src={assets.chat_icon} alt="" />
          </div>

          {messages.length === 0 ?(
            <>
            <div className="flex items-center gap-3">
              <Image src={assets.logo_icon} className="h-16" alt="" />
              <p className="text-2xl font-medium">Hi, I'm Cognitia AI.</p>
            </div>
            <p className="text-sm mt-2">How can I help you today?</p>
            </>
            ):
            (
            <div>
              <Message role='user' content='what is next js' />
            </div>
          )
          }
          <Promtbox isLoading={isLoading} setIsLoading={setIsLoading} />
          <p className="text-xs absolute bottom-1 text-grey-500">AI-genrated, for reference only</p>
        </div>
      </div>
    </div>
  );
}
