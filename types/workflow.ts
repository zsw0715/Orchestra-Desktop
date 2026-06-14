// ============================================================
// 基础枚举 — 全局统一的 Agent 状态与阶段语言
// ============================================================
import type { Node } from "@xyflow/react";

/** 单个 Agent 节点的运行状态 */
export type AgentStatus =
    | "idle"                        // 待命
    | "thinking"                    // 执行中
    | "waiting_human"               // 等待人类输入
    | "done"                        // 完成
    | "error";                      // 出错

/** 宏观工作流阶段 */
export type WorkflowPhase =
    | "alignment"                   // Phase 0: 对齐需求，拆分子 Agent
    | "research"                    // Phase 1: Research — 信息扩张
    | "plan"                        // Phase 2: Plan — 约束收紧
    | "write";                      // Phase 3: Write — 最终产出

// ============================================================
// 节点 data 类型
// ============================================================
/** Orchestrator 节点的 data */
export interface OrchestratorData extends Record<string, unknown> {
    label: string;
    phase: WorkflowPhase;
    status: AgentStatus;
    systemPrompt: string;
    model: string;
    model_icon: string;
    temperature: number;
    maxTokens: number;
    reasoning: boolean;
    maxRounds: number;
    subagents: SubagentRef[];
    tools: ToolRef[];               // 可调用工具
    skills: SkillRef[];             // 可加载技能
    humanSteering: string | null;   // 人类修正指令
}

export interface SubagentRef {
    name: string;
    description: string;
    nodeId: string;
    status: AgentStatus;
}

export interface ToolRef {
    name: string;
    description: string;
}

export interface SkillRef {
    name: string;
    description: string;
}

/** SubAgent（领域 Agent）节点的 data */
export interface SubagentData extends Record<string, unknown> {
    label: string;
    role: string;
    description: string;
    status: AgentStatus;
    phase: WorkflowPhase;
    tools: string[];
    findings: string | null;
}

// ============================================================
// Workflow 共享运行时状态 
// ============================================================
export interface WorkflowState {
    task: string;
    currentPhase: WorkflowPhase;
    messages: WorkflowMessage[];
    orchestratorDecisions: string[];
    subagentResults: Record<
        string,
        {
            status: AgentStatus;
            output: string | null;
            humanFeedback: string | null;
        }
    >;
    finalOutput: string | null;
}

export interface WorkflowMessage {
    role: string;
    content: string;
    timestamp: string;
}

// ============================================================
// React Flow 整合类型
// ============================================================
export type AppNode = Node<OrchestratorData, "orchestrator"> | Node<SubagentData, "subagent">;
