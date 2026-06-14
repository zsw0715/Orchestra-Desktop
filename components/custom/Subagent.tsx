"use client";

import { memo, useState } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import type { SubagentData } from "@/types/workflow";
import { ChessKnight, Pencil } from "lucide-react";
import { DeepSeek, Kimi, Zhipu, Qwen } from "@lobehub/icons";
import { cn } from "@/lib/utils";
import SubagentConfigDrawer from "./SubagentConfigDrawer";

/* ===== model icon map ===== */
const modelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    deepseek: DeepSeek,
    moonshot: Kimi,
    zhipu: Zhipu,
    dashscope: Qwen,
};

const statusBorder: Record<SubagentData["status"], string> = {
    idle: "border-neutral-700",
    thinking: "border-blue-500 shadow-blue-500/20",
    waiting_human: "border-amber-500 shadow-amber-500/20",
    done: "border-emerald-500 shadow-emerald-500/20",
    error: "border-red-500 shadow-red-500/20",
};

const statusGlow: Record<SubagentData["status"], string> = {
    idle: "",
    thinking: "bg-blue-300 blur-sm animate-rotate",
    waiting_human: "bg-amber-300 blur-sm animate-pulse",
    done: "bg-emerald-300 blur-sm scale-100",
    error: "bg-red-300 blur-sm animate-pulse",
};

const phaseLabel: Record<SubagentData["phase"], string> = {
    alignment: "Alignment",
    research: "Research",
    plan: "Plan",
    write: "Write",
};

/** 仅比较该 node 实际渲染的字段 */
const arePropsEqual = (prev: NodeProps, next: NodeProps) => {
    const pd = prev.data as unknown as SubagentData;
    const nd = next.data as unknown as SubagentData;
    return (
        prev.selected === next.selected &&
        pd.status === nd.status &&
        pd.phase === nd.phase &&
        pd.label === nd.label &&
        pd.role === nd.role &&
        pd.model === nd.model &&
        pd.tools.length === nd.tools.length &&
        pd.skills.length === nd.skills.length
    );
};

const SubagentNode = ({ id, data, selected }: NodeProps) => {
    const d = data as unknown as SubagentData;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { updateNodeData, fitView } = useReactFlow();

    const focusThis = () => fitView({ nodes: [{ id }], duration: 600, padding: 0.5, maxZoom: 1.5 });

    const ModelIcon = modelIcons[d.model_icon] ?? null;

    return (
        <div className="relative">
            {/* 光晕 */}
            <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-2xl scale-90 flex items-center justify-center transition-all duration-400",
                selected && d.status === "idle" ? "bg-sky-300 blur-sm scale-100" : statusGlow[d.status],
            )} />
            {/* 卡片 */}
            <div
                onClick={focusThis}
                className={cn(
                    "relative w-75 rounded-3xl border px-4 pt-3.75 pb-4 backdrop-blur-3xl z-10 transition-colors duration-1000 cursor-pointer",
                    d.status !== "idle" && "transition-border duration-500",
                    selected && d.status === "idle" ? "border-sky-400 bg-[#1a1a1a]" : cn(statusBorder[d.status], "bg-[#1a1a1a]"),
                )}
            >
                {/* 头部 */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                        <ChessKnight className="w-4 h-4 text-sky-300 shrink-0" />
                        <span className="font-semibold text-sm text-neutral-100">
                            {d.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                    <button
                        onClick={() => {                            
                            setDrawerOpen(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-md text-[11px] text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition-colors"
                    >
                        <Pencil className="w-2.5 h-2.5 mb-px" />
                        Edit
                    </button>
                    </div>
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
                        {ModelIcon && <ModelIcon className="w-3 h-3 shrink-0" />}
                        <span className="font-mono">{d.model}</span>
                    </span>
                </div>

                {/* Role */}
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] text-neutral-500">Role</span>
                    <span className="text-xs text-neutral-300">{d.role}</span>
                </div>

                {/* Tools */}
                <div className="mb-3">
                    <span className="block text-[11px] text-neutral-500 mb-1.5">
                        Tools
                    </span>
                    {d.tools.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {d.tools.map((t) => (
                                <span
                                    key={t.name}
                                    className="inline-block px-2 pt-0.5 pb-px rounded-md text-[11px] bg-neutral-800 text-neutral-300 border border-neutral-700"
                                >
                                    {t.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg text-center px-2 py-1.5 text-[11px] text-neutral-600 border border-neutral-800">No tools configured</div>
                    )}
                </div>

                {/* Skills */}
                <div className="mb-px">
                    <span className="block text-[11px] text-neutral-500 mb-1.5">
                        Skills
                    </span>
                    {d.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {d.skills.map((s) => (
                                <span
                                    key={s.name}
                                    className="inline-block px-2 pt-0.5 pb-px rounded-md text-[11px] bg-neutral-800 text-neutral-300 border border-neutral-700"
                                >
                                    {s.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg text-center px-2 py-1.5 text-[11px] text-neutral-600 border border-neutral-800">No skills loaded</div>
                    )}
                </div>

                <Handle
                    type="target"
                    position={Position.Top}
                    className="w-7! h-1! rounded-3xl! border-neutral-600! hover:border-sky-400! shadow-md! hover:w-20! hover:h-2! hover:rounded-sm! transition-[width,height,border-radius,border-color]! duration-300!"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="w-7! h-1! rounded-3xl! border-neutral-600! hover:border-sky-400! shadow-md! hover:w-20! hover:h-2! hover:rounded-sm! transition-[width,height,border-radius,border-color]! duration-300!"
                />
            </div>
            {/* Config Drawer */}
            <SubagentConfigDrawer
                open={drawerOpen}
                data={d}
                onClose={() => setDrawerOpen(false)}
                onSave={(updated) => updateNodeData(id, updated)}
            />
        </div>
    );
};

export default memo(SubagentNode, arePropsEqual);
