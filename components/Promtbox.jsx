import React, { useState } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'

const Promtbox = ({ isLoading, setIsLoading }) => {

    const[promt, setPrompt] = useState("");



  return (
    <form action="" className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} p-4 rounded-3xl mt-4 transition-all bg-[#404045]`}>
        <textarea
            className='outline-none w-full resize-none overflow-hidden break-words bg-transparent' 
            rows={2}
            value={promt}
            onChange={(e)=> setPrompt(e.target.value)}
            placeholder='Message Congintia.' required />

            <div className='flex items-center justify-between text-sm'>
                <div className='flex items-center gap-2'>
                    <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                        <Image src={assets.deepthink_icon} className='h-5' alt=''/>
                        Deepthink (R1)
                    </p>

                    <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                        <Image src={assets.search_icon} className='h-5' alt=''/>
                        Search
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <Image src={assets.pin_icon} className='w-4 cursor-pointer' alt=''/>
                    <button className={`${promt ? "bg-primary":"bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
                        <Image src={promt ? assets.arrow_icon: assets.arrow_icon_dull} className='w-3.5 aspect-square cursor-pointer' alt=''/>
                    </button>    
                </div>
            </div>
    </form>
  )
}

export default Promtbox
