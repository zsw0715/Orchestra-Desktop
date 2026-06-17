"use client";

import { PanelLeftClose, Home as HomeIcon } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import ChatInput from "@/components/studio/ChatInput";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AppSidebar() {
    const { sidebarWidth, isSidebarOpen, setIsSidebarOpen } = useSidebar();

    return (
        <div
            className={cn(
                "relative h-full shrink-0 flex flex-col rounded-l-[12px] rounded-r-[12px] transition-all duration-500 origin-left",
                "bg-[#181818] border border-[#373737]",
                isSidebarOpen ? "scale-100 opacity-100 translate-x-0" : "scale-97 opacity-75 -translate-x-20"
            )}
            style={{
                width: `${sidebarWidth}px`,
                // transform: isSidebarOpen ? "perspective(800px) rotateY(0deg)" : "perspective(1200px) rotateY(8deg)",
            }}
        >
            {/* 可拖动标题栏 */}
            <div className={`absolute top-0 left-0 w-full h-8 cursor-grabbing`} data-tauri-drag-region />
            {/* 关闭侧边栏按钮 */}
            <div className="absolute right-2 top-2 p-1.5 rounded-md hover:bg-white/10 cursor-pointer transition-all duration-500" onClick={() => setIsSidebarOpen(false)}>
                <PanelLeftClose className="w-4 h-4 text-[#b0b0b0]" />
            </div>
            <Link href="/studio" className="absolute right-10 top-2 p-1.5 rounded-md hover:bg-white/10 cursor-pointer transition-all duration-500">
                <HomeIcon className="w-4 h-4 text-[#b0b0b0]" />
            </Link>
            {/* 导航栏 */}
            {/* conversation title */}
            <div className="absolute top-2.25 left-20 text-[#b0b0b0] text-[16px] font-bold w-[65%] cursor-pointer">
                Conversation Title
            </div>
            <div className="flex flex-1 flex-col mt-10 px-1.5 text-[#b0b0b0] rounded-[12px] text-[14.5px]">
                {/* conversation content */}
                <div className="flex-1 flex items-center justify-center hover:bg-neutral-100/3 rounded-b-3xl rounded-t-md mb-8 mx-1.5 transition-colors duration-300">
                    This is where human chat with the assistant.
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#2d2d2d]/50 backdrop-blur-xl shadow-lg w-[calc(100%-24px)] flex flex-col rounded-[19px] border border-[#373737] z-30">
                    <ChatInput />
                </div>
            </div>
        </div>
    );
}
