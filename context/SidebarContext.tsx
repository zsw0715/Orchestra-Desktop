"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(465);

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen, sidebarWidth, setSidebarWidth }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
