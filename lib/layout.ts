/**
 * 非 dagre 手搓布局：Orchestrator 在上，N 个 Subagent 在下一行居中排开。
 *
 * 外层节点（KB / Orchester / Research Group / Plan / Write Group）：
 *   垂直堆叠，水平居中。
 * Group 内节点（Subagent + Research / Write + Output）：
 *   水平排开 + 垂直堆叠。
 * Group 尺寸根据子节点数量动态计算。
 */

export interface OrchLayout {
    x: number;
    y: number;
}

export interface SubLayout {
    x: number;
    y: number;
}

export interface GroupLayout {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ComputeLayoutResult {
    knowledgeBase: OrchLayout;
    orchestrator: OrchLayout;
    subagents: SubLayout[];
    research: SubLayout[];
    researchGroup: GroupLayout;
}

const ORCH_X = 500;
const ORCH_Y = 100;
const ORCH_HALF_WIDTH = 210; // Orchestrator w-105 ≈ 420px / 2

// const KB_WIDTH_EMPTY = 192;  // ExternalKB empty  w-48
const KB_WIDTH_FILLED = 352; // ExternalKB loaded  w-88
// const KB_GAP_EMPTY = 100;    // KB(empty)  → Orchestrator
const KB_GAP_FILLED = 80;    // KB(loaded) → Orchestrator

const SUB_WIDTH = 320; // Subagent w-75 ≈ 300px + 预留间距
const SUB_GAP = 88;
const SUB_Y_OFFSET = 560;

const TASK_R_W = 256;  // TaskResearch w-64
const TASK_R_H = 192;  // TaskResearch h-48
const TASK_R_GAP = 48; // Sub 底部 → Research 顶部间距
const SUB_ACTUAL_W = 300; // Subagent 实际宽 w-75

// Research Group 内边距
const RG_LABEL_H = 28;  // 标签区高度
const RG_PAD_X = 16;
const RG_PAD_TOP = 4;   // 标签区上方
const RG_PAD_BOT = 6;

/** 计算 Orchester 下方 N 个 Subagent 的居中水平排布坐标 */
export function computeLayout(subCount: number): ComputeLayoutResult {
    const totalWidth = subCount * SUB_WIDTH + (subCount - 1) * SUB_GAP;
    const startX = ORCH_X + ORCH_HALF_WIDTH - totalWidth / 2;

    const subY = ORCH_Y + SUB_Y_OFFSET;
    const researchY = subY + 320 + TASK_R_GAP; // 320 = Subagent h-80

    const subagents: SubLayout[] = Array.from({ length: subCount }, (_, i) => ({
        x: startX + i * (SUB_WIDTH + SUB_GAP),
        y: subY,
    }));

    const researchXs = Array.from({ length: subCount }, (_, i) =>
        startX + i * (SUB_WIDTH + SUB_GAP) + (SUB_ACTUAL_W - TASK_R_W) / 2,
    );

    const firstRX = researchXs[0];
    const lastRX = researchXs[subCount - 1];
    const groupWidth = lastRX - firstRX + TASK_R_W + RG_PAD_X * 2;
    const groupHeight = RG_LABEL_H + RG_PAD_TOP + TASK_R_H + RG_PAD_BOT;

    const groupX = firstRX - RG_PAD_X;
    const groupY = researchY - RG_LABEL_H - RG_PAD_TOP;

    const research: SubLayout[] = researchXs.map((rx) => ({
        x: rx - groupX,
        y: RG_LABEL_H + RG_PAD_TOP,
    }));

    return {
        knowledgeBase: { x: ORCH_X - KB_WIDTH_FILLED - KB_GAP_FILLED, y: ORCH_Y },
        orchestrator: { x: ORCH_X, y: ORCH_Y },
        subagents,
        research,
        researchGroup: { x: groupX, y: groupY, width: groupWidth, height: groupHeight },
    };
}

/**
 * Research Group 内布局：
 *   顶部一行 Subagent 节点
 *   每个 Subagent 下方跟一个 Research 节点
 */
export interface ResearchGroupLayout {
    groupX: number;
    groupY: number;
    groupWidth: number;
    groupHeight: number;
    subagents: {
        id: string;
        x: number;
        y: number;
    }[];
    research: {
        id: string;
        x: number;
        y: number;
    }[];
}

const GROUP_PADDING_X = 24;
const GROUP_PADDING_TOP = 48;
const GROUP_PADDING_BOTTOM = 24;
const SUB_H = 320; // h-80
const RESEARCH_H = 120;
const V_GAP = 20; // Sub 底部到 Research 顶部

export function computeResearchGroupLayout(
    groupX: number,
    groupY: number,
    subIds: string[],
    researchIds: string[],
): ResearchGroupLayout {
    const count = subIds.length;
    const totalWidth = count * SUB_WIDTH + (count - 1) * SUB_GAP;
    const contentHeight = GROUP_PADDING_TOP + SUB_H + V_GAP + RESEARCH_H;

    const subagents = subIds.map((id, i) => ({
        id,
        x: GROUP_PADDING_X + i * (SUB_WIDTH + SUB_GAP),
        y: GROUP_PADDING_TOP,
    }));

    const research = researchIds.map((id, i) => ({
        id,
        x: GROUP_PADDING_X + i * (SUB_WIDTH + SUB_GAP) + (SUB_ACTUAL_W - 192) / 2, // Research node 居中
        y: GROUP_PADDING_TOP + SUB_H + V_GAP,
    }));

    return {
        groupX,
        groupY,
        groupWidth: GROUP_PADDING_X * 2 + totalWidth,
        groupHeight: contentHeight + GROUP_PADDING_BOTTOM,
        subagents,
        research,
    };
}
