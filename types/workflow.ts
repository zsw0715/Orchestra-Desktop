// TODO: 暂时，具体定义需要和后端对齐，后序再调整

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
// 共享微类型
// ============================================================
export interface ToolRef {
    name: string;
    description: string;
}

export interface SkillRef {
    name: string;
    description: string;
}

export interface SubagentRef {
    name: string;
    description: string;
    /** 对应的 Subagent 节点 ID */
    nodeId: string;
    status: AgentStatus;
}

/** AutoGen 群聊中的一条消息 */
export interface ChatMessage {
    role: string;                   // "住宿Agent" | "美食Agent" | "orchestrator" | "human"
    content: string;
    timestamp: string;
}

// ============================================================
// 节点 data 类型
// ============================================================

/** Orchestrator 编排节点的 data */
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
    tools: ToolRef[];
    skills: SkillRef[];
    humanSteering: string | null;
}

/** Subagent 领域 Agent 节点的 data */
export interface SubagentData extends Record<string, unknown> {
    label: string;
    role: string;
    description: string;
    status: AgentStatus;
    phase: WorkflowPhase;
    model: string;
    model_icon: string;
    temperature: number;
    maxTokens: number;
    reasoning: boolean;
    tools: ToolRef[];
    skills: SkillRef[];
}

/** KnowledgeBase 外挂知识库节点的 data */
export interface KnowledgeBaseData extends Record<string, unknown> {
    label: string;
    status: AgentStatus;
    source: string;                 // "RAG / 个人数据库"
    documentCount: number;          // 已索引文档数
    files: string[];                // 已索引文件名
    folderName: string;             // 选中的文件夹名称
}

/** Research 调研产出节点（Phase 1，每个 Subagent 下方一个） */
export interface ResearchData extends Record<string, unknown> {
    label: string;
    status: AgentStatus;
    subagentId: string;             // 归属的 Subagent 节点 ID
    findings: string[];             // 调研发现列表
}

/** Plan 群聊协调节点（Phase 2，长条单节点） */
export interface PlanData extends Record<string, unknown> {
    label: string;
    status: AgentStatus;
    summary: string;                // 群聊摘要（显示在节点上）
    messages: ChatMessage[];        // 完整群聊记录
}

/** Write 撰写节点（Phase 3，每个 Subagent 一个） */
export interface WriteData extends Record<string, unknown> {
    label: string;
    status: AgentStatus;
    subagentId: string;             // 归属的 Subagent 节点 ID
    content: string;                // 该 Agent 撰写的章节内容
}

/** Output 最终产出节点（Phase 3，汇总所有 Write） */
export interface OutputData extends Record<string, unknown> {
    label: string;
    status: AgentStatus;
    content: string;                // 拼接后全文
    mergedFrom: string[];           // 来源 Write 节点 ID 列表
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
export type AppNode =
    | Node<OrchestratorData, "orchestrator">
    | Node<SubagentData, "subagent">
    | Node<KnowledgeBaseData, "knowledgeBase">
    | Node<ResearchData, "research">
    | Node<PlanData, "plan">
    | Node<WriteData, "write">
    | Node<OutputData, "output">;
