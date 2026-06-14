import { DeepSeek, Kimi, Zhipu, Qwen } from "@lobehub/icons";
import type { ComponentType } from "react";

export interface ModelConfig {
    id: string;
    label: string;
    provider: string;
    icon: ComponentType<{ className?: string }>;
}

export const MODELS: ModelConfig[] = [
    // DeepSeek
    { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash", provider: "deepseek", icon: DeepSeek },
    { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro", provider: "deepseek", icon: DeepSeek },
    // Kimi (Moonshot AI)
    { id: "kimi-k2.5", label: "Kimi K2.5", provider: "moonshot", icon: Kimi },
    { id: "kimi-k2.6", label: "Kimi K2.6", provider: "moonshot", icon: Kimi },
    // 智谱AI (GLM)
    { id: "glm-5-turbo", label: "GLM-5 Turbo", provider: "zhipu", icon: Zhipu },
    { id: "glm-5.1", label: "GLM-5.1", provider: "zhipu", icon: Zhipu },
    // 通义千问 (DashScope)
    { id: "qwen3.6-35b-a3b", label: "Qwen3.6 35B", provider: "dashscope", icon: Qwen },
    { id: "qwen3.6-plus", label: "Qwen3.6 Plus", provider: "dashscope", icon: Qwen },
];

export function getModel(id: string): ModelConfig {
    return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

export function getModelLabel(id: string): string {
    return getModel(id).label;
}
