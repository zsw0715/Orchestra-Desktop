"use client";

import { memo, useCallback, useEffect } from "react";
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow,
    addEdge,
    type OnConnect,
    type Node,
    type Edge,
} from "@xyflow/react";
import OrchestratorNode from "./Orchestrator";
import Subagent from "./Subagent";
import type { OrchestratorData , SubagentData } from "@/types/workflow";
import { computeLayout } from "@/lib/layout";
import { useSidebar } from "@/context/SidebarContext";

const nodeTypes = {
    orchestrator: OrchestratorNode,
    subagent: Subagent,
};

// MOCK DATA
const layout = computeLayout(3);

const initialNodes: Node[] = [
    {
        id: "orchestrator-1",
        type: "orchestrator",
        position: layout.orchestrator,
        data: {
            label: "Orchestrator",
            phase: "alignment",
            status: "idle",
            systemPrompt: "你是一个任务协调者，负责将用户需求拆分为子任务并分派给领域 Agent。",
            model: "deepseek-v4-flash",
            model_icon: "deepseek",
            temperature: 0.7,
            maxTokens: 4096,
            reasoning: false,
            maxRounds: 5,
            subagents: [
                {
                    name: "住宿 Subagent",
                    description: "调研和推荐住宿方案",
                    nodeId: "subagent-lodging",
                    status: "idle",
                },
                {
                    name: "美食 Subagent",
                    description: "调研和推荐当地美食",
                    nodeId: "subagent-food",
                    status: "idle",
                },
                {
                    name: "景点 Subagent",
                    description: "调研和规划景点路线",
                    nodeId: "subagent-sights",
                    status: "idle",
                },
            ],
            tools: [
                { name: "search", description: "搜索网络信息" },
                { name: "delegate", description: "派发子任务给子 Agent" },
                { name: "summarize", description: "汇总子 Agent 结果" },
            ],
            skills: [
                { name: "travel-planning", description: "旅行规划 SOP：拆分维度、冲突协调、行程模板" },
                { name: "conflict-resolution", description: "Plan 阶段多 Agent 冲突协调方法论" },
            ],
            humanSteering: "我喜欢吃，所以说一切计划以美食为中心！麻溜滴！速速！！",
        } satisfies OrchestratorData,
    },
    {
        id: "subagent-lodging",
        type: "subagent",
        position: layout.subagents[0],
        data: {
            label: "住宿 Subagent",
            role: "住宿调研专员",
            description: "调研和推荐住宿方案",
            status: "idle",
            phase: "research",
            model: "deepseek-v4-flash",
            model_icon: "deepseek",
            temperature: 0.7,
            maxTokens: 4096,
            reasoning: false,
            tools: [
                { name: "search", description: "搜索网络信息" },
                { name: "summarize", description: "汇总调研结果" },
            ],
            skills: [
                { name: "travel-planning", description: "旅行规划 SOP" },
            ],
        } satisfies SubagentData,
    },
    {
        id: "subagent-food",
        type: "subagent",
        position: layout.subagents[1],
        data: {
            label: "美食 Subagent",
            role: "美食调研专员",
            description: "调研和推荐当地美食",
            status: "idle",
            phase: "research",
            model: "kimi-k2.5",
            model_icon: "moonshot",
            temperature: 0.5,
            maxTokens: 4096,
            reasoning: false,
            tools: [
                { name: "search", description: "搜索网络信息" },
            ],
            skills: [
                { name: "food-research", description: "美食调研方法论" },
            ],
        } satisfies SubagentData,
    },
    {
        id: "subagent-sights",
        type: "subagent",
        position: layout.subagents[2],
        data: {
            label: "景点 Subagent",
            role: "景点调研专员",
            description: "调研和规划景点路线",
            status: "idle",
            phase: "research",
            model: "qwen3.6-plus",
            model_icon: "dashscope",
            temperature: 0.8,
            maxTokens: 8192,
            reasoning: true,
            tools: [
                { name: "search", description: "搜索网络信息" },
                { name: "summarize", description: "汇总调研结果" },
            ],
            skills: [],
        } satisfies SubagentData,
    },
];

const initialEdges: Edge[] = [
    { id: "e-o-lodging", source: "orchestrator-1", target: "subagent-lodging", animated: true, style: { stroke: "#525252" } },
    { id: "e-o-food", source: "orchestrator-1", target: "subagent-food", animated: true, style: { stroke: "#525252" } },
    { id: "e-o-sights", source: "orchestrator-1", target: "subagent-sights", animated: true, style: { stroke: "#525252" } },
];

function FlowInner() {
    const { isSidebarOpen } = useSidebar();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { fitView } = useReactFlow();

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((es) => addEdge(params, es)),
        [setEdges],
    );

    // sidebar 切换后重新聚焦当前选中的节点
    useEffect(() => {
        const timer = setTimeout(() => {
            const selectedNode = nodes.find((n) => n.selected);
            if (selectedNode) {
                fitView({ nodes: [{ id: selectedNode.id }], duration: 400, padding: 0.5, maxZoom: 1.5 });
            }
        }, 520); // 略大于 sidebar CSS transition duration (500ms)
        return () => clearTimeout(timer);
    }, [isSidebarOpen]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // (nodes is intentionally omitted — we only want to react to sidebar toggle)

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                panOnScroll
                nodesDraggable={false}
                selectNodesOnDrag={false}
                elevateNodesOnSelect={false}
                proOptions={{ hideAttribution: true }}
            >
                <Background gap={26} size={1} />
            </ReactFlow>
        </div>
    );
}

function AgenticWorkflow() {
    return (
        <ReactFlowProvider>
            <FlowInner />
        </ReactFlowProvider>
    );
}

export default memo(AgenticWorkflow);
