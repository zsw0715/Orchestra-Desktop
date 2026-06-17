"use client";

import { memo } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import type { WriteData } from "@/types/workflow";
import { FilePenLine, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_PREVIEW_CHARS = 80;

const TaskWritingNode = ({ id, data, selected }: NodeProps) => {
    const d = data as unknown as WriteData;
    const { fitView } = useReactFlow();

    const focusThis = () => fitView({ nodes: [{ id }], duration: 600, padding: 0.5, maxZoom: 1.5 });

    const excerpt = d.content.slice(0, MAX_PREVIEW_CHARS);
    const hiddenCount = d.content.length - MAX_PREVIEW_CHARS;

    return (
        <div className="relative">
            {/* 光晕 */}
            <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-2xl scale-90 flex items-center justify-center transition-all duration-400",
                selected ? "bg-neutral-400 blur-sm scale-100" : "",
            )} />
            {/* 卡片 */}
            <div
                onClick={focusThis}
                className={cn(
                    "relative w-64 h-33 rounded-2xl border border-neutral-700 px-4 pt-3 pb-3.5 backdrop-blur-3xl z-10 transition-colors duration-1000 cursor-pointer bg-[#1a1a1a]",
                    selected && "border-neutral-400",
                )}
            >
                {/* 头部 */}
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-800">
                    <div className="flex items-center gap-1.5">
                        <FilePenLine className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="font-semibold text-xs text-neutral-100 truncate max-w-36">
                            {d.label}
                        </span>
                    </div>
                </div>

                {/* 内容预览 */}
                {d.content ? (
                    <p className="text-[11px] text-neutral-400 leading-tight line-clamp-5">
                        {excerpt}
                    </p>
                ) : (
                    <p className="text-[11px] text-neutral-600 italic py-1">
                        Not written yet…
                    </p>
                )}

                {/* 更多提示 */}
                {hiddenCount > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-neutral-500 hover:text-neutral-400 transition-colors cursor-pointer">
                        <ChevronRight className="w-3 h-3" />
                        <span>+{hiddenCount} more chars</span>
                    </div>
                )}
            </div>

            {/* Top Handle ← Plan */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-7! h-1! z-100! rounded-3xl! border-neutral-500! hover:border-neutral-400! shadow-md! hover:w-20! hover:h-2! hover:rounded-sm! transition-[width,height,border-radius,border-color]! duration-300!"
            />

            {/* Bottom Handle → Output */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-7! h-1! z-100! rounded-3xl! border-neutral-500! hover:border-neutral-400! shadow-md! hover:w-20! hover:h-2! hover:rounded-sm! transition-[width,height,border-radius,border-color]! duration-300!"
            />
        </div>
    );
};

export default memo(TaskWritingNode);
