"use client";

import AppSidebar from "@/components/custom/AppSidebar";
import AppMainContent from "@/components/custom/AppMainContent";
import { PanelLeftOpen } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useDrawer } from "@/context/DrawerContext";
import { useDialog } from "@/context/DialogContext";

export default function Home() {
    const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
    const { isOpen: isDrawerOpen } = useDrawer();
    const { isOpen: isDialogOpen } = useDialog();

    const scale = (isDrawerOpen || isDialogOpen) ? 0.97 : 1;
    const translateX = isDrawerOpen ? "-5.5%" : "0%";

    return (
        <div className="flex-1 overflow-hidden rounded-r-[12.5px] rounded-l-[14px]">
            <div
                className="flex flex-row h-[calc(100vh-7.5px)] transition-transform duration-500 ease-out"
                style={{
                    transform: `scale(${scale}) translateX(${translateX})`,
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
