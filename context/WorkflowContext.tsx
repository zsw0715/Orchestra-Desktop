"use client";

import {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    type ReactNode,
} from "react";
import type {
    WorkflowState,
    WorkflowPhase,
    AgentStatus,
} from "@/types/workflow";

// ============================================================
// Context 类型定义
// ============================================================
interface WorkflowContextType {
    state: WorkflowState;

    /** 切换宏观阶段 */
    advancePhase: (phase: WorkflowPhase) => void;

    /** 人类在检查点注入修正指令 */
    injectHumanSteering: (nodeId: string, signal: string) => void;

    /** 更新节点运行状态 */
    updateAgentStatus: (nodeId: string, status: AgentStatus) => void;

    /** 推进流程（模拟：idle → thinking → done） */
    stepForward: () => void;
}

// ============================================================
// 演示用初始状态
// ============================================================
const demoState: WorkflowState = {
    task: "五一假期要去重庆玩，帮我规划行程",
    currentPhase: "alignment",
    messages: [
        {
            role: "user",
            content: "帮我规划五一假期的重庆旅行。",
            timestamp: new Date().toISOString(),
        },
        {
            role: "orchestrator",
            content: "好的，我先理清需求。你偏好什么类型的旅行？预算如何？需要我拆分成住宿、美食、景点、交通四个维度来调研吗？",
            timestamp: new Date().toISOString(),
        },
    ],
    orchestratorDecisions: [],
    subagentResults: {},
    finalOutput: null,
};

// ============================================================
// Context
// ============================================================
const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// ============================================================
// Provider
// ============================================================
export function WorkflowProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WorkflowState>(demoState);

    const advancePhase = useCallback((phase: WorkflowPhase) => {
        setState((prev) => ({ ...prev, currentPhase: phase }));
    }, []);

    const injectHumanSteering = useCallback(
        (nodeId: string, signal: string) => {
            setState((prev) => ({
                ...prev,
                messages: [
                    ...prev.messages,
                    {
                        role: "human",
                        content: signal,
                        timestamp: new Date().toISOString(),
                    },
                ],
                subagentResults: {
                    ...prev.subagentResults,
                    [nodeId]: {
                        ...(prev.subagentResults[nodeId] ?? {
                            status: "idle" as AgentStatus,
                            output: null,
                            humanFeedback: null,
                        }),
                        humanFeedback: signal,
                    },
                },
            }));
        },
        [],
    );

    const updateAgentStatus = useCallback(
        (nodeId: string, status: AgentStatus) => {
            setState((prev) => ({
                ...prev,
                subagentResults: {
                    ...prev.subagentResults,
                    [nodeId]: {
                        ...(prev.subagentResults[nodeId] ?? {
                            output: null,
                            humanFeedback: null,
                        }),
                        status,
                    },
                },
            }));
        },
        [],
    );

    // 简单演示推进：当前阶段所有 idle → done
    const stepForward = useCallback(() => {
        setState((prev) => {
            // 对 subagentResults 里每个条目的 status 推进一步
            const nextResults = { ...prev.subagentResults };
            for (const key of Object.keys(nextResults)) {
                const cur = nextResults[key].status;
                if (cur === "idle") nextResults[key] = { ...nextResults[key], status: "thinking" };
                else if (cur === "thinking") nextResults[key] = { ...nextResults[key], status: "done" };
            }
            return { ...prev, subagentResults: nextResults };
        });
    }, []);

    const value = useMemo(
        () => ({
            state,
            advancePhase,
            injectHumanSteering,
            updateAgentStatus,
            stepForward,
        }),
        [state, advancePhase, injectHumanSteering, updateAgentStatus, stepForward],
    );

    return (
        <WorkflowContext.Provider value={value}>
            {children}
        </WorkflowContext.Provider>
    );
}

// ============================================================
// Hook
// ============================================================
export function useWorkflow() {
    const context = useContext(WorkflowContext);
    if (!context) {
        throw new Error("useWorkflow must be used within a WorkflowProvider");
    }
    return context;
}
