"use client";

import { memo, useCallback } from "react";
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    type OnConnect,
    type Node,
    type Edge,
} from "@xyflow/react";
import OrchestratorNode from "./Orchestrator";
import type { OrchestratorData } from "@/types/workflow";

const nodeTypes = {
    orchestrator: OrchestratorNode,
};

// MOCK DATA
const initialNodes: Node[] = [
    {
        id: "orchestrator-1",
        type: "orchestrator",
        position: { x: 300, y: 200 },
        data: {
            label: "Orchestrator",
            phase: "alignment",
            status: "idle",
            systemPrompt: "你是一个任务协调者，负责将用户需求拆分为子任务并分派给领域 Agent。",
            model: "deepseek-v4-flash",
            model_icon: "deepseek",
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
];

const initialEdges: Edge[] = [];

function AgenticWorkflow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((es) => addEdge(params, es)),
        [setEdges],
    );

    return (
        <ReactFlowProvider>
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
        </ReactFlowProvider>
    );
}

export default memo(AgenticWorkflow);
