"use client";

import { Dialog } from "@/components/ui/dialog";
import type { KnowledgeBaseData } from "@/types/workflow";
import { ChessKing, Cross } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    data: KnowledgeBaseData;
}

export default function ExternalKBConfigDialog({ open, onClose, data }: Props) {
    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }} width={888} height={700}>
            <div className="relative flex flex-col h-full">
                {/* 标题 */}
                <div className="absolute top-0 flex items-center gap-2 pl-3 pr-4 pt-2.25 pb-1.75 rounded-2xl mt-2.5 bg-neutral-50/5 border border-neutral-700 backdrop-blur-xs   mx-2.5">
                    <ChessKing className="w-4 h-4 text-amber-400 mb-0.75" />
                    <span className="text-sm font-semibold text-neutral-100">
                        {data.folderName || "Knowledge Base"}
                    </span>
                </div>

                {/* 内容区，先空着 */}
                <div className="flex flex-1 flex-col gap-3 px-5 py-4 min-h-40 overflow-y-auto pt-16.5">
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                    <p className="text-xs text-neutral-500">Configuration coming soon...</p>
                </div>

                {/* 底部 */}
                <div 
                    onClick={onClose}
                    className="group/close hover:animate-pulse absolute bottom-0 right-0 hover:bg-neutral-700/50 cursor-pointer transition-all duration-250 flex items-center gap-2 pl-3 pr-4 pt-2.25 pb-1.75 rounded-2xl mb-2.5 bg-neutral-50/5 border border-neutral-700 backdrop-blur-xs mx-2.5"
                >
                    <Cross className="group-hover/close:rotate-225 group-hover/close:translate-x-5.5 transition-all duration-250 w-3.5 h-3.5 text-red-400 rotate-45 mb-px" />
                    <span className="group-hover/close:text-white/0 transition-all duration-300 text-xs font-semibold text-neutral-100">
                        Close 
                    </span>
                </div>
            </div>
        </Dialog>
    );
}
