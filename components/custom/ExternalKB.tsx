"use client";

import { memo, useCallback, useState, useRef, useEffect } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import { createPortal } from "react-dom";
import type { KnowledgeBaseData } from "@/types/workflow";
import { ChessRook, FolderOpen, Trash2, FolderSearch2 } from "lucide-react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { open } from "@tauri-apps/plugin-dialog";
import { readDir } from "@tauri-apps/plugin-fs";
import { cn } from "@/lib/utils";

/* ===== recursive dir reader ===== */
async function collectFiles(dirPath: string, prefix = ""): Promise<string[]> {
    const result: string[] = [];
    const entries = await readDir(dirPath);
    for (const entry of entries) {
        const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isFile) {
            result.push(fullPath);
        } else if (entry.isDirectory && !entry.name.startsWith(".")) {
            try {
                const nested = await collectFiles(`${dirPath}/${entry.name}`, fullPath);
                result.push(...nested);
            } catch {
                // skip inaccessible subdirectories (e.g. __pycache__)
            }
        }
    }
    return result;
}

const ExternalKBNode = ({ id, data, selected }: NodeProps) => {
    const d = data as unknown as KnowledgeBaseData;
    const { updateNodeData } = useReactFlow();
    const isEmpty = d.documentCount === 0;

    const handleSelectFolder = useCallback(async () => {
        try {
            const dirPath = await open({ directory: true, multiple: false });
            if (!dirPath || typeof dirPath !== "string") return;

            const fileNames = await collectFiles(dirPath);
            const folderName = dirPath.split("/").pop() || dirPath;
            updateNodeData(id, {
                documentCount: fileNames.length,
                files: fileNames,
                folderName,
            });
        } catch {
            // user cancelled or error
        }
    }, [id, updateNodeData]);

    // context menu
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const clearKnowledgeBase = useCallback(() => {
        updateNodeData(id, {
            documentCount: 0,
            files: [],
            folderName: "",
        });
        setContextMenu(null);
    }, [id, updateNodeData]);

    const reopenFolder = useCallback(() => {
        setContextMenu(null);
        handleSelectFolder();
    }, [handleSelectFolder]);

    const onContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
    }, []);

    // close on any click outside
    useEffect(() => {
        if (!contextMenu) return;
        const close = () => setContextMenu(null);
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [contextMenu]);

    return (
        <div className="relative">
            {/* 卡片 */}
            <div
                onContextMenu={onContextMenu}
                onClick={isEmpty ? handleSelectFolder : undefined}
                className={cn(
                    "relative rounded-3xl border backdrop-blur-3xl z-10 transition-colors duration-500",
                    // 空状态：正方形
                    isEmpty
                        ? "w-48 h-48 border-dashed border-neutral-600 bg-[#1a1a1a] cursor-pointer hover:border-amber-500/50"
                        : "w-88 border-neutral-700 bg-[#1a1a1a]",
                    selected && "border-amber-400 bg-[#1a1a1a]",
                    !isEmpty && !selected && "shadow-lg shadow-neutral-900/50",
                )}
            >
                {/* 空状态 */}
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <ChessRook className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="text-center">
                            <span className="block text-xs font-medium text-neutral-400">
                                External Knowledge Base
                            </span>
                            <span className="block text-[11px] text-neutral-600 mt-1">
                                Click to select a folder
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="relative flex flex-col">
                        <div className="absolute -top-3 -left-9 rounded-full bg-amber-500/90 border border-amber-500/30 backdrop-blur-md flex items-center px-3 py-1 text-[11px] font-medium text-white shadow-sm shadow-amber-500/5 opacity-100 -rotate-20">
                            Knowledge Base
                        </div>
                        {/* 头部 */}
                        <div className="flex items-center gap-2 ml- px-4 pt-3.5 pb-2.5 border-b border-neutral-800">
                            <ChessRook className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="font-semibold text-sm text-neutral-100 truncate">
                                {d.folderName || d.label}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // 打开 dialog
                                    // TODO
                                }}
                                className="flex ml-auto items-center gap-1 px-2 py-0.5 rounded-md text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
                            >
                                <FolderSearch2 className="w-3 h-3" />
                                More
                            </button>
                        </div>

                        {/* 文件九宫格 */}
                        <div className="grid grid-cols-3 gap-2 p-3 mb-1 max-h-56 overflow-y-auto">
                            {d.files.slice(0, 9).map((name) => {
                                const ext = name.split(".").pop()?.toLowerCase() || "";
                                const style = (defaultStyles as Record<string, object>)[ext] || {};
                                return (
                                    <div
                                        key={name}
                                        className="flex flex-col items-center gap-1 p-2 rounded-xl bg-neutral-800/40 border border-neutral-700/40 hover:border-amber-500/30 transition-colors cursor-default"
                                        title={name}
                                    >
                                        <div className="w-5 h-5">
                                            <FileIcon extension={ext} {...style} />
                                        </div>
                                        <span className="text-[10px] text-neutral-500 text-center leading-tight truncate w-full">
                                            {name}
                                        </span>
                                    </div>
                                );
                            })}
                            {d.files.length > 9 && (
                                <div className="flex items-center justify-center rounded-xl mb-2 bg-neutral-800/20 border border-neutral-800">
                                    <span className="text-[11px] text-neutral-600">
                                        +{d.files.length - 9}
                                    </span>
                                </div>
                            )}
                        </div>
                        <span className="absolute bottom-2.75 right-5 text-[11px] text-neutral-500 ml-auto shrink-0">
                            {d.documentCount} docs
                        </span>
                    </div>
                )}

                {/* Right Handle → Orchestrator */}
                <Handle
                    type="source"
                    position={Position.Right}
                    className="h-7! w-1! rounded-3xl! border-amber-200! hover:border-amber-400! shadow-md! hover:h-20! hover:w-2! hover:rounded-sm! transition-[width,height,border-radius,border-color]! duration-300!"
                />
            </div>

            {/* Context Menu */}
            {contextMenu && createPortal(
                <div
                    ref={menuRef}
                    className="fixed z-50 rounded-xl border px-1 border-neutral-700 bg-[#1f1f1f]/95 backdrop-blur-xl shadow-xl shadow-black/40 py-1"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    <button
                        onClick={reopenFolder}
                        className="flex items-center rounded-lg gap-2 w-full px-3 pt-2 pb-1.25 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-neutral-100 transition-colors cursor-pointer"
                    >
                        <FolderOpen className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                        Reopen folder
                    </button>
                    <button
                        onClick={clearKnowledgeBase}
                        className="flex items-center gap-2 rounded-lg w-full px-3 pt-2 pb-1.25 text-xs text-red-400/80 hover:bg-neutral-800/80 hover:text-red-400 transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5 mb-0.5" />
                        Clear knowledge base
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};

export default memo(ExternalKBNode);
