"use client";

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react";

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

    const handleSetIsSidebarOpen = useCallback((open: boolean) => setIsSidebarOpen(open), []);
    const handleSetSidebarWidth = useCallback((width: number) => setSidebarWidth(width), []);

    const value = useMemo(
        () => ({
            isSidebarOpen,
            setIsSidebarOpen: handleSetIsSidebarOpen,
            sidebarWidth,
            setSidebarWidth: handleSetSidebarWidth,
        }),
        [isSidebarOpen, sidebarWidth, handleSetIsSidebarOpen, handleSetSidebarWidth]
    );

    return (
        <SidebarContext.Provider value={value}>
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
