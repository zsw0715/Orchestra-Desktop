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
    MarkerType,
    type OnConnect,
    type Node,
    type Edge,
    Panel,
} from "@xyflow/react";
import OrchestratorNode from "./Orchestrator";
import Subagent from "./Subagent";
import ExternalKB from "./ExternalKB";
import TaskResearch from "./TaskResearch";
import type { OrchestratorData, SubagentData, KnowledgeBaseData, ResearchData } from "@/types/workflow";
import { computeLayout } from "@/lib/layout";
import { useSidebar } from "@/context/SidebarContext";
import { useWorkflow } from "@/context/WorkflowContext";
import { Maximize, Pause, Play, Square } from "lucide-react";

const nodeTypes = {
    orchestrator: OrchestratorNode,
    subagent: Subagent,
    knowledgeBase: ExternalKB,
    taskResearch: TaskResearch,
};

// MOCK DATA
const layout = computeLayout(3);

const initialNodes: Node[] = [
    {
        id: "knowledge-base",
        type: "knowledgeBase",
        position: layout.knowledgeBase,
        data: {
            label: "Knowledge Base",
            status: "idle",
            source: "RAG / 个人数据库",
            documentCount: 0,
            files: [],
            folderName: "",
        } satisfies KnowledgeBaseData,
    },
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
    // ===== Research 节点 =====
    {
        id: "research-lodging",
        type: "taskResearch",
        position: layout.research[0],
        data: {
            label: "住宿调研",
            status: "idle",
            subagentId: "subagent-lodging",
            findings: [
                "解放碑附近酒店性价比高，步行可达洪崖洞",
                "南岸区民宿视野好，但交通不太方便",
                "观音桥商圈周边有多个4星酒店",
                "朝天门区域江景房旺季价格翻倍",
                "南滨路公寓安静但有上下坡",
            ],
        } satisfies ResearchData,
    },
    {
        id: "research-food",
        type: "taskResearch",
        position: layout.research[1],
        data: {
            label: "美食调研",
            status: "idle",
            subagentId: "subagent-food",
            findings: [
                "解放碑好吃街必吃酸辣粉和陈麻花",
                "观音桥九街是夜宵和新派川菜聚集地",
            ],
        } satisfies ResearchData,
    },
    {
        id: "research-sights",
        type: "taskResearch",
        position: layout.research[2],
        data: {
            label: "景点调研",
            status: "idle",
            subagentId: "subagent-sights",
            findings: [],
        } satisfies ResearchData,
    },
];

const initialEdges: Edge[] = [
    { id: "e-o-lodging", source: "orchestrator-1", target: "subagent-lodging", animated: true, style: { stroke: "#737373" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#737373", width: 30, height: 30 } },
    { id: "e-o-food", source: "orchestrator-1", target: "subagent-food", animated: true, style: { stroke: "#737373" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#737373", width: 30, height: 30 } },
    { id: "e-o-sights", source: "orchestrator-1", target: "subagent-sights", animated: true, style: { stroke: "#737373" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#737373", width: 30, height: 30 } },
    { id: "e-sub-r-lodging", source: "subagent-lodging", target: "research-lodging", animated: true, style: { stroke: "#737373" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#737373", width: 20, height: 20 } },
    { id: "e-sub-r-food", source: "subagent-food", target: "research-food", animated: true, style: { stroke: "#737373" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#737373", width: 20, height: 20 } },
    { id: "e-sub-r-sights", source: "subagent-sights", target: "research-sights", animated: true, style: { stroke: "#737373" }, markerEnd: { type: MarkerType.ArrowClosed, color: "#737373", width: 20, height: 20 } },
];

function FlowInner() {
    const { isSidebarOpen } = useSidebar();
    const { orchestrating, toggleOrchestrating } = useWorkflow();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    const onConnect: OnConnect = useCallback(
        (params) => {
            const isKBtoOrch = params.source === "knowledge-base" && params.target === "orchestrator-1";
            const isOrchtoSubagent = params.source === "orchestrator-1" && params.target.startsWith("subagent-");
            setEdges((es) => addEdge({
                ...params,
                animated: true,
                style: { stroke: isKBtoOrch ? "#d97706" : "#737373" },
                ...(isKBtoOrch ? { markerEnd: { type: MarkerType.ArrowClosed, color: "#d97706", width: 40, height: 40 } } : {}),
                ...(isOrchtoSubagent ? { markerEnd: { type: MarkerType.ArrowClosed, color: "#737373", width: 30, height: 30 } } : {}),
            }, es));
        },
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
                <Panel
                    position="bottom-left"
                    className="relative overflow-visible"
                >
                    <div
                        className="flex flex-col items-center shadow-lg rounded-lg overflow-hidden bg-neutral-800/60 backdrop-blur-sm border border-b-0 border-neutral-700"
                        style={{
                            clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 150% 100%, 0% 100%)',
                            width: '2rem',
                            paddingBottom: '2rem',
                        }}
                    >
                        <button
                            onClick={() => zoomIn({ duration: 500 })}
                            className="w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-neutral-700/80 text-neutral-300 transition-colors"
                        >
                            +
                        </button>
                        <button
                              onClick={() => zoomOut({ duration: 500 })}
                            className="w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-neutral-700/80 text-neutral-300 transition-colors"
                        >
                            −
                        </button>
                        <button
                            onClick={() => fitView({ duration: 500 })}
                            className="w-8 h-8 flex items-center justify-center hover:bg-neutral-700/80 text-neutral-300 transition-colors"
                        >
                            <Maximize className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <button
                        onClick={() => {/* TODO: pause pipeline / add checkpoint */}}
                        className="absolute bottom-0 border-t border-neutral-800/60 backdrop-blur-xs left-0 w-40 h-8 flex items-center justify-center text-xs font-medium bg-neutral-800/60 hover:bg-neutral-700/80 text-neutral-400 transition-colors rounded-bl-lg shadow-lg"
                    >
                        <Pause className="w-3.5 h-3.5 mr-1.5" /> Add Checkpoint
                    </button>
                    <button
                        onClick={toggleOrchestrating}
                        className={
                            orchestrating
                                ? "overflow-hidden absolute bottom-0 group left-40 border-t border-red-800 w-40 h-8 flex items-center justify-center text-xs font-medium bg-neutral-800/60 text-neutral-400 transition-colors rounded-lg rounded-tl-none rounded-bl-none shadow-lg backdrop-blur-xs active:shadow-inner"
                                : "overflow-hidden absolute bottom-0 group left-40 border-t border-blue-800 w-40 h-8 flex items-center justify-center text-xs font-medium bg-neutral-800/60 text-neutral-400 transition-colors rounded-lg rounded-tl-none rounded-bl-none shadow-lg backdrop-blur-xs active:shadow-inner"
                        }
                    >
                        <div className={
                            orchestrating
                                ? "absolute inset-0 w-full h-full transition-all duration-300 scale-x-0 group-hover:scale-x-100 group-hover:bg-linear-to-r from-red-500 via-red-600 to-red-700 origin-left bg-red-500/90"
                                : "absolute inset-0 w-full h-full transition-all duration-300 scale-x-0 group-hover:scale-x-100 group-hover:bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 origin-left bg-blue-500/90"
                        } />
                        {orchestrating ? (
                            <>
                                <Square className="z-10 w-3 h-3 mr-1.5 group-hover:animate-pulse" />
                                <span className="z-10 group-hover:text-white group-hover:animate-pulse">Stop Orchestration</span>
                            </>
                        ) : (
                            <>
                                <Play className="z-10 w-3.5 h-3.5 mr-1.5 group-hover:animate-pulse" />
                                <span className="z-10 group-hover:text-white group-hover:animate-pulse">Start Orchestration</span>
                            </>
                        )}
                    </button>
                </Panel>
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
