"use client";

import { useSidebar } from "@/context/SidebarContext";
import { FolderSymlink } from "lucide-react";
import { cn } from "@/lib/utils";

const MODELS = [
    { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash" },
    { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro" },
] as const;

export default function AppMainContent() {
    const { isSidebarOpen, sidebarWidth } = useSidebar();

    return (
        <div
            className="relative flex-1 flex rounded-[12.5px] bg-[#181818] border border-[#373737] z-10 transition-[margin] duration-300 ease-out text-[#b0b0b0]" 
            style={{ marginLeft: isSidebarOpen ? 2.5 : `-${sidebarWidth}px` }}
        >
            {/* 可拖动标题栏 */}
            <div className="absolute top-0 left-0 h-8 w-full z-100 bg-transparent cursor-grabbing" data-tauri-drag-region />
            This is supposed to be empty for now
        </div>
    );
}
