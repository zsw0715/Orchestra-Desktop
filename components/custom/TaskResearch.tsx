"use client";

import { memo } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import type { ResearchData } from "@/types/workflow";
import { Lightbulb, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_FINDINGS = 3;

const TaskResearchNode = ({ id, data, selected }: NodeProps) => {
    const d = data as unknown as ResearchData;
    const { fitView } = useReactFlow();

    const focusThis = () => fitView({ nodes: [{ id }], duration: 600, padding: 3.5, maxZoom: 1.5 });

    const visibleFindings = d.findings.slice(0, MAX_VISIBLE_FINDINGS);
    const hiddenCount = d.findings.length - MAX_VISIBLE_FINDINGS;

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
                        <Lightbulb className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="font-semibold text-xs text-neutral-100 truncate max-w-36">
                            {d.label}
                        </span>
                    </div>
                </div>

                {/* Findings 列表 */}
                {visibleFindings.length > 0 ? (
                    <ul className="space-y-1.5 mb-0.5">
                        {visibleFindings.map((finding, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-1.5 text-[11px] text-neutral-400 leading-tight"
                            >
                                <span className="text-neutral-500 mt-0.5 shrink-0">•</span>
                                <span className="line-clamp-2">{finding}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-[11px] text-neutral-600 italic py-1">
                        No findings yet…
                    </p>
                )}

                {/* 更多提示 */}
                {hiddenCount > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-neutral-500 hover:text-neutral-400 transition-colors cursor-pointer">
                        <ChevronRight className="w-3 h-3" />
                        <span>+{hiddenCount} more</span>
                    </div>
                )}
            </div>

            {/* Top Handle ← Subagent */}
            <Handle 
                type="target"
                position={Position.Top}
                className="w-7! h-1! z-100! rounded-3xl! border-neutral-500! hover:border-neutral-400! shadow-md! hover:w-20! hover:h-2! hover:rounded-sm! transition-[width,height,border-radius,border-color]! duration-300!"
            />

            {/* Bottom Handle → Plan */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-7! h-1! z-100! rounded-3xl! border-neutral-500! hover:border-neutral-400! shadow-md! hover:w-20! hover:h-2! hover:rounded-sm! transition-[width,height,border-radius,border-color]! duration-300!"
            />
        </div>
    );
};

export default memo(TaskResearchNode);
