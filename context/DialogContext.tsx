"use client";

import {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    type ReactNode,
} from "react";

interface DialogContextType {
    isOpen: boolean;
    setOpen: (v: boolean) => void;
}

const DialogCtx = createContext<DialogContextType | undefined>(undefined);
export { DialogCtx };

export function DialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setOpen] = useState(false);

    const handleSetOpen = useCallback((v: boolean) => setOpen(v), []);

    const value = useMemo(() => ({ isOpen, setOpen: handleSetOpen }), [isOpen, handleSetOpen]);

    return <DialogCtx.Provider value={value}>{children}</DialogCtx.Provider>;
}

export function useDialog() {
    const ctx = useContext(DialogCtx);
    if (!ctx) throw new Error("useDialog must be used within DialogProvider");
    return ctx;
}
