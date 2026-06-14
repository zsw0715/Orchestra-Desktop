"use client";

import { useState, useEffect } from "react";
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from "@/components/ui/drawer";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown";
import type { OrchestratorData, ToolRef, SkillRef } from "@/types/workflow";
import { Sliders, X, Plus, Trash2, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODELS, getModelLabel } from "@/lib/models";

interface Props {
    open: boolean;
    data: OrchestratorData;
    onClose: () => void;
    onSave: (updated: Partial<OrchestratorData>) => void;
}

export default function OrchestratorConfigDrawer({ open, data, onClose, onSave }: Props) {
    const [model, setModel] = useState(data.model);
    const [temperature, setTemperature] = useState(data.temperature);
    const [maxTokens, setMaxTokens] = useState(data.maxTokens);
    const [reasoning, setReasoning] = useState(data.reasoning);
    const [maxRounds, setMaxRounds] = useState(data.maxRounds);
    const [tools, setTools] = useState<ToolRef[]>(data.tools);
    const [skills, setSkills] = useState<SkillRef[]>(data.skills);
    const [steering, setSteering] = useState(data.humanSteering ?? "");

    const [newToolName, setNewToolName] = useState("");
    const [newSkillName, setNewSkillName] = useState("");

    useEffect(() => {
        if (open) {
            setModel(data.model);
            setTemperature(data.temperature);
            setMaxTokens(data.maxTokens);
            setReasoning(data.reasoning);
            setMaxRounds(data.maxRounds);
            setTools(data.tools);
            setSkills(data.skills);
            setSteering(data.humanSteering ?? "");
        }
    }, [open, data]);

    const handleSave = () => {
        onSave({
            model,
            temperature,
            maxTokens,
            reasoning,
            maxRounds,
            tools,
            skills,
            humanSteering: steering || null,
        });
        onClose();
    };

    const addTool = () => {
        if (!newToolName.trim()) return;
        setTools((prev) => [...prev, { name: newToolName.trim(), description: "" }]);
        setNewToolName("");
    };

    const removeTool = (name: string) => {
        setTools((prev) => prev.filter((t) => t.name !== name));
    };

    const addSkill = () => {
        if (!newSkillName.trim()) return;
        setSkills((prev) => [...prev, { name: newSkillName.trim(), description: "" }]);
        setNewSkillName("");
    };

    const removeSkill = (name: string) => {
        setSkills((prev) => prev.filter((s) => s.name !== name));
    };

    const currentModelLabel = getModelLabel(model);

    const currentModelIcon = MODELS.find((m) => m.id === model)?.icon;
    const ModelIcon = currentModelIcon;

    return (
        <Drawer open={open} onOpenChange={(v) => { if (!v) onClose(); }} direction="right">
            <div className="flex flex-col h-full w-[400px]">
                <DrawerHeader>
                    <div className="flex items-center pl-2.5 pr-4 py-2 my-3 ml-3 border border-neutral-800 rounded-xl gap-2 ">
                        <Sliders className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-100">Orchestrator Config</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 mr-3.5 text-2xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </DrawerHeader>

                <DrawerBody>
                    <div className="space-y-5">
                        {/* ===== Model ===== */}
                        <fieldset>
                            <legend className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Model</legend>
                            <Dropdown className="w-full">
                                <DropdownTrigger className="w-full flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-200 hover:border-neutral-500 transition-colors cursor-pointer">
                                    {ModelIcon && <ModelIcon className="w-4 h-4 shrink-0" />}
                                    <span className="flex-1 text-left">{currentModelLabel}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                </DropdownTrigger>
                                <DropdownContent
                                    align="start"
                                    activeIndex={MODELS.findIndex((m) => m.id === model)}
                                    className="w-[calc(400px-2.5rem)] bg-[#2a2a2b]/65 backdrop-blur-xl border border-[#373737] rounded-xl p-1 shadow-xl animate-in fade-in zoom-in-95 duration-150"
                                >
                                    {MODELS.map((m) => {
                                        const ItemIcon = m.icon;
                                        return (
                                            <DropdownItem
                                                key={m.id}
                                                onClick={() => setModel(m.id)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-[#e6e2e3] hover:bg-white/5 rounded-lg cursor-pointer focus:bg-white/10"
                                            >
                                                <ItemIcon className="w-4 h-4 shrink-0" />
                                                <span className="flex-1">{m.label}</span>
                                                {m.id === model && (
                                                    <Check className="w-3.5 h-3.5 text-[#e6e2e3]" />
                                                )}
                                            </DropdownItem>
                                        );
                                    })}
                                </DropdownContent>
                            </Dropdown>
                        </fieldset>

                        {/* ===== Temperature ===== */}
                        <fieldset>
                            <legend className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Temperature</legend>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    value={temperature}
                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                    className="flex-1 accent-amber-500"
                                />
                                <span className="text-sm font-mono text-neutral-300 w-8 text-right">{temperature.toFixed(1)}</span>
                            </div>
                        </fieldset>

                        {/* ===== Max Tokens ===== */}
                        <fieldset>
                            <legend className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Max Tokens</legend>
                            <input
                                type="number"
                                min={256}
                                max={131072}
                                step={256}
                                value={maxTokens}
                                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4096)}
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-200 focus:border-neutral-500 focus:outline-none"
                            />
                        </fieldset>

                        {/* ===== Reasoning Toggle ===== */}
                        <fieldset className="flex items-center justify-between">
                            <legend className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Reasoning</legend>
                            <button
                                type="button"
                                onClick={() => setReasoning((v) => !v)}
                                className={cn(
                                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                                    reasoning ? "bg-amber-500" : "bg-neutral-700",
                                )}
                            >
                                <span
                                    className={cn(
                                        "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition duration-200",
                                        reasoning ? "translate-x-4" : "translate-x-0",
                                    )}
                                />
                            </button>
                        </fieldset>

                        {/* ===== Max Rounds ===== */}
                        <fieldset>
                            <legend className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Max Rounds</legend>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={maxRounds}
                                onChange={(e) => setMaxRounds(parseInt(e.target.value) || 1)}
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-200 focus:border-neutral-500 focus:outline-none"
                            />
                        </fieldset>

                        {/* ===== Tools ===== */}
                        <fieldset>
                            <legend className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Tools</legend>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {tools.map((t) => (
                                    <span
                                        key={t.name}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-neutral-800 text-neutral-300 border border-neutral-700"
                                    >
                                        {t.name}
                                        <button onClick={() => removeTool(t.name)} className="text-neutral-600 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {tools.length === 0 && <span className="text-xs text-neutral-600">No tools</span>}
                            </div>
                            <div className="flex gap-1">
                                <input
                                    placeholder="Tool name"
                                    value={newToolName}
                                    onChange={(e) => setNewToolName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addTool()}
                                    className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800/50 px-2.5 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
                                />
                                <button
                                    onClick={addTool}
                                    disabled={!newToolName.trim()}
                                    className="rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-1.5 text-neutral-400 hover:text-neutral-200 disabled:opacity-40 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </fieldset>

                        {/* ===== Skills ===== */}
                        <fieldset>
                            <legend className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Skills</legend>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {skills.map((s) => (
                                    <span
                                        key={s.name}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-violet-950/25 text-violet-300 border border-violet-500/20"
                                    >
                                        {s.name}
                                        <button onClick={() => removeSkill(s.name)} className="text-violet-500/50 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {skills.length === 0 && <span className="text-xs text-neutral-600">No skills</span>}
                            </div>
                            <div className="flex gap-1">
                                <input
                                    placeholder="Skill name"
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                                    className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800/50 px-2.5 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
                                />
                                <button
                                    onClick={addSkill}
                                    disabled={!newSkillName.trim()}
                                    className="rounded-lg bg-neutral-800 border border-neutral-700 px-2.5 py-1.5 text-neutral-400 hover:text-neutral-200 disabled:opacity-40 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </fieldset>

                        {/* ===== Steering ===== */}
                        <fieldset>
                            <legend className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Steering</legend>
                            <textarea
                                value={steering}
                                onChange={(e) => setSteering(e.target.value)}
                                placeholder="Human steering gradient signal..."
                                rows={3}
                                className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-amber-500 focus:outline-none resize-none"
                            />
                        </fieldset>
                    </div>
                </DrawerBody>

                <DrawerFooter className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 rounded-lg bg-amber-500/90 hover:bg-amber-500 px-4 py-2 text-sm font-medium text-black transition-colors"
                    >
                        Save Changes
                    </button>
                </DrawerFooter>
            </div>
        </Drawer>
    );
}
