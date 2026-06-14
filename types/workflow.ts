import type { Node } from "@xyflow/react";

// ============================================================
// 基础枚举 — 全局统一的 Agent 状态与阶段语言
// ============================================================

/** 单个 Agent 节点的运行状态 */
export type AgentStatus =
  | "idle"          // 待命
  | "thinking"      // 执行中
  | "waiting_human" // 等待人类输入
  | "done"          // 完成
  | "error";        // 出错

/** 宏观工作流阶段（对应 AGENTS.md 的三阶段 + 对齐） */
export type WorkflowPhase =
  | "alignment"  // Phase 0: 对齐需求，拆分子 Agent
  | "research"   // Phase 1: Research — 信息扩张
  | "plan"       // Phase 2: Plan — 约束收紧
  | "write";     // Phase 3: Write — 最终产出

// ============================================================
// 节点 data 类型 — 每个节点自身的配置身份证
// ============================================================

/** Orchestrator（协调者）节点的 data */
export interface OrchestratorData {
  label: string;
  phase: WorkflowPhase;
  status: AgentStatus;

  // Agent 配置（AG2 / LangGraph 初始化用）
  systemPrompt: string;
  model: string;    // e.g. "gpt-4o"
  maxRounds: number;

  // 子 Agent 阵容（引用式：只存 name + nodeId，详细定义在子节点自身 data 中）
  subagents: SubagentRef[];

  // 可调用工具
  tools: ToolRef[];

  // 人类修正指令（梯度信号）
  humanSteering: string | null;
}

/** 对子 Agent 的轻量引用 */
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

/** SubAgent（领域 Agent）节点的 data */
export interface SubagentData {
  label: string;
  role: string;       // e.g. "住宿Agent"
  description: string;
  status: AgentStatus;
  phase: WorkflowPhase;
  tools: string[];
  findings: string | null;
}

// ============================================================
// Workflow 共享运行时状态 — 对应 LangGraph State 的前端镜像
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

export type AppNodeData = OrchestratorData | SubagentData;

export type AppNode = Node<AppNodeData, string>;
