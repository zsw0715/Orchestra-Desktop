"use client";

import {
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/* ================================================================ */
/*  Drawer                                                            */
/* ================================================================ */
interface DrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    direction: "left" | "right";
}

const DURATION = 250; // ms

export function Drawer({ open, onOpenChange, children, direction }: DrawerProps) {
    const [show, setShow] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    const close = () => {
        onOpenChange(false);
    };

    // Esc 关闭
    useEffect(() => {
        if (!open) return;
        const handler = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open]);

    // 锁 body 滚动
    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = "";
            };
        }
    }, [show]);

    // 打开：先挂 DOM
    useEffect(() => {
        if (open) setShow(true);
    }, [open]);

    // DOM 就绪后下一帧触发滑入动画
    useEffect(() => {
        if (!show) return;
        const raf = requestAnimationFrame(() => setAnimateIn(true));
        return () => cancelAnimationFrame(raf);
    }, [show]);

    // 关闭：先滑出，等动画结束后卸载 DOM
    useEffect(() => {
        if (!open && show) {
            setAnimateIn(false);
            const timer = setTimeout(() => setShow(false), DURATION);
            return () => clearTimeout(timer);
        }
    }, [open, show]);

    if (!show) return null;

    const isRight = direction === "right";
    const translateOpen = "translateX(0)";
    const translateClosed = isRight ? "translateX(100%)" : "translateX(-100%)";

    return createPortal(
        <>
            {/* 遮罩 */}
            <div
                onClick={close}
                className={cn(
                    "fixed inset-0 z-40 bg-black/15 backdrop-blur-xs",
                    "transition-opacity",
                    animateIn ? "opacity-100" : "opacity-0",
                )}
                style={{ transitionDuration: `${DURATION}ms` }}
            />
            {/* 面板 */}
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "fixed top-1.5 bottom-1.5 z-50 bg-[#181818]",
                    isRight ? "right-1.5 border-l rounded-r-[11px] rounded-l-[24px]" : "left-1.5 border-r rounded-l-[11px] rounded-r-[11px]",
                    "border-neutral-800",
                )}
                style={{
                    transition: `transform ${DURATION}ms ease-out`,
                    transform: animateIn ? translateOpen : translateClosed,
                }}
            >
                {children}
            </div>
        </>,
        document.body,
    );
}

/* ================================================================ */
/*  Sub-components                                                    */
/* ================================================================ */
interface SectionProps {
    children: ReactNode;
    className?: string;
}

export function DrawerHeader({ children, className }: SectionProps) {
    return (
        <div className={cn("flex items-center justify-between border-neutral-800", className)}>
            {children}
        </div>
    );
}

export function DrawerBody({ children, className }: SectionProps) {
    return (
        <div className={cn("flex-1 overflow-y-auto px-5 py-4", className)}>
            {children}
        </div>
    );
}

export function DrawerFooter({ children, className }: SectionProps) {
    return (
        <div className={cn(" border-neutral-800 px-0 py-0", className)}>
            {children}
        </div>
    );
}
