"use client";

import AppSidebar from "@/components/custom/AppSidebar";
import AppMainContent from "@/components/custom/AppMainContent";
import { PanelLeftOpen } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export default function Home() {
    const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

    return (
        <div className="flex flex-row flex-1 rounded-[12.5px] h-[calc(100vh-7.5px)] overflow-hidden">
            {!isSidebarOpen && (
                <div className="absolute z-20 top-3 left-22 p-1.25 rounded-md hover:bg-white/10 cursor-pointer transition-all duration-200" onClick={() => setIsSidebarOpen(true)}>
                    <PanelLeftOpen className="w-4 h-4 text-[#b0b0b0]" />
                </div>
            )}
            <AppSidebar />
            <AppMainContent />
        </div>
    );
}
