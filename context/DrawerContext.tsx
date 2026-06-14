"use client";

import {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    type ReactNode,
} from "react";

interface DrawerContextType {
    isOpen: boolean;
    setOpen: (v: boolean) => void;
}

const DrawerCtx = createContext<DrawerContextType | undefined>(undefined);
export { DrawerCtx };

export function DrawerProvider({ children }: { children: ReactNode }) {
    const [isOpen, setOpen] = useState(false);

    const handleSetOpen = useCallback((v: boolean) => setOpen(v), []);

    const value = useMemo(() => ({ isOpen, setOpen: handleSetOpen }), [isOpen, handleSetOpen]);

    return <DrawerCtx.Provider value={value}>{children}</DrawerCtx.Provider>;
}

export function useDrawer() {
    const ctx = useContext(DrawerCtx);
    if (!ctx) throw new Error("useDrawer must be used within DrawerProvider");
    return ctx;
}
