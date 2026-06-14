"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { OrchestratorData } from "@/types/workflow";
import { ChessQueen, ArrowRight, Pencil } from "lucide-react";
import { DeepSeek } from "@lobehub/icons";
import { cn } from "@/lib/utils";

const statusBorder: Record<OrchestratorData["status"], string> = {
    idle: "border-neutral-700",
    thinking: "border-blue-500 shadow-blue-500/20",
    waiting_human: "border-amber-500 shadow-amber-500/20",
    done: "border-emerald-500 shadow-emerald-500/20",
    error: "border-red-500 shadow-red-500/20",
};

const phaseLabel: Record<OrchestratorData["phase"], string> = {
    alignment: "Alignment",
    research: "Research",
    plan: "Plan",
    write: "Write",
};

/** 仅比较该 node 实际渲染的字段，避免其他 node 状态更新波及到全部 node 重渲染 */
const arePropsEqual = (prev: NodeProps, next: NodeProps) => {
    const pd = prev.data as unknown as OrchestratorData;
    const nd = next.data as unknown as OrchestratorData;
    return (
        prev.selected === next.selected &&
        pd.status === nd.status &&
        pd.phase === nd.phase &&
        pd.label === nd.label &&
        pd.humanSteering === nd.humanSteering &&
        pd.model === nd.model &&
        pd.tools.length === nd.tools.length &&
        pd.skills.length === nd.skills.length &&
        pd.subagents.length === nd.subagents.length
    );
};

const OrchestratorNode = ({ data, selected }: NodeProps) => {
    const d = data as unknown as OrchestratorData;

    return (
        <div
            className={cn(
                "relative w-105 rounded-3xl border px-4 pt-3.75 pb-4 bg-[#1a1a1a]",
                d.status !== "idle" && "transition-all duration-500",
                selected ? "border-neutral-400" : statusBorder[d.status],
            )}
        >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                    <ChessQueen className="w-4 h-4 text-amber-400 shrink-0 mb-1" />
                    <span className="font-semibold text-sm text-neutral-100">
                        {d.label}
                    </span>
                </div>
                <button className="flex items-center gap-1 px-3 py-1 rounded-md text-[11px] text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition-colors">
                    <Pencil className="w-2.5 h-2.5 mb-px" />
                    Edit
                </button>
            </div>

            {/* Phase */}
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] text-neutral-500">Phase</span>
                <span className="text-xs font-mono text-neutral-300">
                    {phaseLabel[d.phase]}
                </span>
            </div>

            {/* Model */}
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] text-neutral-500">Model</span>
                <span className="flex items-center gap-1 text-xs text-neutral-300">
                    <DeepSeek className="w-3 h-3 shrink-0" />
                    <span className="font-mono">{d.model}</span>
                </span>
            </div>

            {/* Subagents */}
            <div className="mb-3">
                <div className="flex items-center mb-1.5">
                    <span className="block text-[11px] text-neutral-500">
                        Subagents
                    </span>
                    {d.subagents.length === 0 ? (
                        <span className="text-xs ml-auto text-neutral-300">
                            No subagents configured
                        </span>
                    ) : (
                        <span className="text-xs ml-auto text-neutral-300">
                            {`${d.subagents.length} subagents configured`}
                        </span>
                    )}
                </div>
                {d.subagents.length > 0 && (
                    <div className="space-y-1">
                        {d.subagents.map((a) => (
                            <div
                                key={a.nodeId}
                                className="rounded flex items-center px-2 pt-1.25 pb-0.75 text-[11px] bg-neutral-800/40 border border-neutral-700/40 hover:border-neutral-600/60 transition-colors"
                            >
                                <span className="text-neutral-200 font-medium">{a.name}</span>
                                <ArrowRight className="w-3 h-3 text-neutral-600 mx-1.5 shrink-0" />
                                <span className="text-neutral-500 truncate">{a.description}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tools */}
            {d.tools.length > 0 && (
                <div className="mb-3">
                    <span className="block text-[11px] text-neutral-500 mb-1.5">
                        Tools
                    </span>
                    <div className="flex flex-wrap gap-1">
                        {d.tools.map((t) => (
                            <span
                                key={t.name}
                                className="inline-block px-2 pt-0.5 pb-px rounded text-[11px] bg-neutral-800 text-neutral-300 border border-neutral-700"
                            >
                                {t.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            <div className="mb-3">
                <span className="block text-[11px] text-neutral-500 mb-1.5">
                    Skills
                </span>
                {d.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {d.skills.map((s) => (
                            <span
                                key={s.name}
                                className="inline-block px-2 pt-0.5 pb-px rounded text-[11px] bg-violet-950/25 text-violet-300 border border-violet-500/20"
                            >
                                {s.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg text-center px-2 py-1.5 text-[11px] text-neutral-600 border border-neutral-800">
                        No skills loaded
                    </div>
                )}
            </div>

            {/* Human Steering */}
            <div className="mb-px">
                <span className="block text-[11px] text-neutral-500 mb-1">
                    Steering
                </span>
                {d.humanSteering ? (
                    <div className="rounded-lg px-2 py-1.5 text-[11px] bg-amber-950/30 text-amber-300 border border-amber-500/20">
                        {d.humanSteering.length > 48
                            ? d.humanSteering.slice(0, 48) + "…"
                            : d.humanSteering}
                    </div>
                ) : (
                    <div className="rounded-lg text-center px-2 py-1.5 text-[11px] text-neutral-600 border border-neutral-800">
                        No human steering yet
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-7! h-1! rounded-3xl! hover:border-amber-400! shadow-md! hover:w-20! hover:h-2! hover:rounded-sm! transition-[width,height,border-radius,border-color]! duration-300!"
            />
        </div>
    );
};

export default memo(OrchestratorNode, arePropsEqual);
