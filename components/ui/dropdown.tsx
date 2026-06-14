"use client";

import {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
    useCallback,
    type ReactNode,
    type KeyboardEvent as ReactKeyboardEvent,
} from "react";

interface DropdownContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
    triggerRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

function useDropdown() {
    const ctx = useContext(DropdownContext);
    if (!ctx) throw new Error("Dropdown components must be used within <Dropdown>");
    return ctx;
}

/* ------------------------------------------------------------------ */
/*  Dropdown – root                                                      */
/* ------------------------------------------------------------------ */
interface DropdownProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    children: ReactNode;
    className?: string;
}

export function Dropdown({
    open: controlledOpen,
    onOpenChange,
    defaultOpen = false,
    children,
    className,
}: DropdownProps) {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = (value: boolean) => {
        if (!isControlled) {
            setInternalOpen(value);
        }
        onOpenChange?.(value);
    };

    // 点击外部关闭
    useEffect(() => {
        if (!open) return;
        const handler = (e: globalThis.MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, setOpen]);

    // Esc 关闭
    useEffect(() => {
        if (!open) return;
        const handler = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, setOpen]);

    return (
        <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
            <div ref={containerRef} className={`relative inline-flex ${className}`}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

/* ------------------------------------------------------------------ */
/*  DropdownTrigger                                                     */
/* ------------------------------------------------------------------ */
interface DropdownTriggerProps {
    children: ReactNode;
    className?: string;
}

export function DropdownTrigger({ children, className }: DropdownTriggerProps) {
    const { open, setOpen, triggerRef } = useDropdown();

    const handleClick = () => {
        setOpen(!open);
    };

    const handleKeyDown = (e: ReactKeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
        }
    };

    return (
        <div
            ref={triggerRef}
            role="button"
            tabIndex={0}
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={className}
        >
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  DropdownContent                                                     */
/* ------------------------------------------------------------------ */
interface DropdownContentProps {
    children: ReactNode;
    className?: string;
    align?: "start" | "center" | "end";
    activeIndex?: number;
}

export function DropdownContent({
    children,
    className = "",
    align = "start",
    activeIndex,
}: DropdownContentProps) {
    const { open, setOpen, triggerRef } = useDropdown();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [focusIndex, setFocusIndex] = useState(activeIndex ?? 0);
    const [openUpward, setOpenUpward] = useState(false);

    const getItems = useCallback((): HTMLElement[] => {
        if (!contentRef.current) return [];
        return Array.from(
            contentRef.current.querySelectorAll('[data-dropdown-item]')
        );
    }, []);

    // 打开时检测 trigger 是否在视口下半部分，决定向上/向下弹出
    useEffect(() => {
        if (!open) return;
        const trigger = triggerRef.current;
        if (!trigger) return;
        const rect = trigger.getBoundingClientRect();
        setOpenUpward(rect.top > window.innerHeight * 0.6);
    }, [open, triggerRef]);

    // 打开时聚焦 activeIndex 项，没有则第一项
    useEffect(() => {
        if (!open) return;
        const index = activeIndex ?? 0;
        const raf = requestAnimationFrame(() => {
            setFocusIndex(index);
            const items = getItems();
            items[index]?.focus();
        });
        return () => cancelAnimationFrame(raf);
    }, [open, activeIndex, getItems]);

    const handleKeyDown = (e: ReactKeyboardEvent) => {
        const items = getItems();
        if (items.length === 0) return;

        let nextIndex = focusIndex;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            nextIndex = (focusIndex + 1) % items.length;
            setFocusIndex(nextIndex);
            items[nextIndex]?.focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            nextIndex = (focusIndex - 1 + items.length) % items.length;
            setFocusIndex(nextIndex);
            items[nextIndex]?.focus();
        } else if (e.key === "Enter") {
            e.preventDefault();
            items[focusIndex]?.click();
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    if (!open) return null;

    const alignClass =
        align === "end"
            ? "right-0"
            : align === "center"
              ? "left-1/2 -translate-x-1/2"
              : "left-0";

    const directionClass = openUpward ? "bottom-full mb-1" : "top-full mt-1";

    return (
        <div
            ref={contentRef}
            className={`absolute ${directionClass} z-50 outline-none ${alignClass} ${className}`}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  DropdownItem                                                        */
/* ------------------------------------------------------------------ */
interface DropdownItemProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function DropdownItem({ children, className = "", onClick }: DropdownItemProps) {
    return (
        <div
            data-dropdown-item
            tabIndex={-1}
            role="menuitem"
            onClick={onClick}
            className={`outline-none ${className}`}
        >
            {children}
        </div>
    );
}
