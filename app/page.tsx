"use client";

import AppSidebar from "@/components/custom/AppSidebar";
import AppMainContent from "@/components/custom/AppMainContent";
import { PanelLeftOpen } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useDrawer } from "@/context/DrawerContext";

export default function Home() {
    const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
    const { isOpen: isDrawerOpen } = useDrawer();

    return (
        <div className="flex-1 overflow-hidden rounded-r-[12.5px] rounded-l-[14px]">
            <div
                className="flex flex-row h-[calc(100vh-7.5px)] transition-transform duration-500 ease-out"
                style={{
                    transform: isDrawerOpen
                        ? "scale(0.97) translateX(-5.5%)"
                        : "scale(1) translateX(0)",
                }}
            >
                {!isSidebarOpen && (
                    <div
                        className="absolute z-20 top-2 left-22 p-1.25 rounded-md hover:bg-white/10 cursor-pointer transition-all duration-500"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <PanelLeftOpen className="w-4 h-4 text-[#b0b0b0]" />
                    </div>
                )}
                <AppSidebar />
                <AppMainContent />
            </div>
        </div>
    );
}
