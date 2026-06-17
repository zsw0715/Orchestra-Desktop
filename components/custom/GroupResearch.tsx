"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Microscope } from "lucide-react";

const ResearchGroupNode = ({ data }: NodeProps) => {
    const label = (data as { label?: string }).label ?? "Research";

    return (
        <div className="-translate-y-6 -translate-x-41 w-318.75 h-56 rounded-xl border border-dashed border-sky-400/50 bg-neutral-800/15">
            {/* 标签 */}
            <div className="flex items-center gap-1.5 px-4.5 pt-3.5 pb-1 mt-0.5">
                <Microscope className="w-3 h-3 text-neutral-500" />
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {label}
                </span>
            </div>
        </div>
    );
};

export default memo(ResearchGroupNode);
