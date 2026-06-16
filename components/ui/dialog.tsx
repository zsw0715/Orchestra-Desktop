"use client";

import {
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { DialogCtx } from "@/context/DialogContext";

/* ================================================================ */
/*  Dialog                                                             */
/* ================================================================ */
interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    /** 自定义宽度，默认 448px，支持 px / vw 等任意 CSS 单位 */
    width?: number | string;
    /** 自定义高度，默认 auto（不限制） */
    height?: number | string;
}

const DURATION = 320; // ms

export function Dialog({ open, onOpenChange, children, width = 448, height = "auto" }: DialogProps) {
    const [show, setShow] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    const close = () => {
        onOpenChange(false);
    };

    // 同步全局 DialogContext → page.tsx scale 效果
    const ctx = useContext(DialogCtx);
    useEffect(() => {
        ctx?.setOpen(open);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

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

    // DOM 就绪后下一帧触发动画
    useEffect(() => {
        if (!show) return;
        const raf = requestAnimationFrame(() => setAnimateIn(true));
        return () => cancelAnimationFrame(raf);
    }, [show]);

    // 关闭：先淡出，等动画结束后卸载 DOM
    useEffect(() => {
        if (!open && show) {
            setAnimateIn(false);
            const timer = setTimeout(() => setShow(false), DURATION);
            return () => clearTimeout(timer);
        }
    }, [open, show]);

    if (!show) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 蒙层 */}
            <div
                onClick={close}
                className={cn(
                    "absolute inset-0 bg-black/20 backdrop-blur-xs transition-opacity",
                    animateIn ? "opacity-100" : "opacity-0",
                )}
                style={{ transitionDuration: `${DURATION}ms` }}
            />
            {/* 面板 */}
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "relative rounded-[27.5px] border border-neutral-700 bg-[#1a1a1a] shadow-2xl shadow-black/50 transition-all z-10",
                    animateIn
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-4 scale-95",
                )}
                style={{
                    width: typeof width === "number" ? `${width}px` : width,
                    height: typeof height === "number" ? `${height}px` : height,
                    transitionDuration: `${DURATION}ms`,
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                }}
            >
                {children}
            </div>
        </div>,
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

export function DialogHeader({ children, className }: SectionProps) {
    return (
        <div className={cn("flex items-center justify-between border-b border-neutral-800 px-5 py-4", className)}>
            {children}
        </div>
    );
}

export function DialogBody({ children, className }: SectionProps) {
    return (
        <div className={cn("overflow-y-auto px-5 py-4", className)}>
            {children}
        </div>
    );
}

export function DialogFooter({ children, className }: SectionProps) {
    return (
        <div className={cn("flex border-t border-neutral-800 px-5 py-4", className)}>
            {children}
        </div>
    );
}
