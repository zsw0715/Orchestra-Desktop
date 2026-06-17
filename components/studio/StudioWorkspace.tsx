"use client";

import AppSidebar from "@/components/studio/StudioSidebar";
import AppMainContent from "@/components/studio/StudioMainContent";
import { PanelLeftOpen, Home as HomeIcon } from "lucide-react";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { WorkflowProvider } from "@/context/WorkflowContext";
import { DrawerProvider, useDrawer } from "@/context/DrawerContext";
import { DialogProvider, useDialog } from "@/context/DialogContext";
import Link from "next/link";

export default function StudioWorkspace({ studioId }: { studioId: string }) {
    return (
        <WorkflowProvider>
            <SidebarProvider>
                <DrawerProvider>
                    <DialogProvider>
                        <StudioWorkspaceInner studioId={studioId} />
                    </DialogProvider>
                </DrawerProvider>
            </SidebarProvider>
        </WorkflowProvider>
    );
}

function StudioWorkspaceInner({ studioId }: { studioId: string }) {
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
                    <>
                        <Link
                            href="/studio"
                            className="absolute z-20 top-2 left-22 p-1.25 rounded-md hover:bg-white/10 cursor-pointer transition-all duration-500"
                        >
                            <HomeIcon className="w-4 h-4 text-[#b0b0b0]" />
                        </Link>
                        <div
                            className="absolute z-20 top-2 left-30 flex items-center p-1.25 rounded-md hover:bg-white/10 cursor-pointer transition-all duration-500"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <PanelLeftOpen className="w-4 h-4 text-[#b0b0b0]" />
                        </div>
                    </>
                )}
                <AppSidebar />
                <AppMainContent />
            </div>
        </div>
    );
}
