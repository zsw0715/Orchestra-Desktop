"use client";

import { WorkflowProvider } from "@/context/WorkflowContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { DrawerProvider } from "@/context/DrawerContext";
import { DialogProvider } from "@/context/DialogContext";

export default function StudioDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WorkflowProvider>
            <SidebarProvider>
                <DrawerProvider>
                    <DialogProvider>
                        {children}
                    </DialogProvider>
                </DrawerProvider>
            </SidebarProvider>
        </WorkflowProvider>
    );
}
