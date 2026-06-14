"use client";

import TextareaAutosize from "react-textarea-autosize";
import { ArrowUp, Plus, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useCallback, memo, type KeyboardEvent } from "react";
import { DeepSeek } from "@lobehub/icons";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown";

const MODELS = [
    { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash" },
    { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro" },
] as const;

interface ChatInputProps {
}

export default memo(function ChatInput({  }: ChatInputProps) {
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [model, setModel] = useState<string>(MODELS[0].id);
    const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
    const isComposingRef = useRef(false);

    const onCompositionStart = useCallback(() => {
        isComposingRef.current = true;
    }, []);

    const onCompositionEnd = useCallback(() => {
        setTimeout(() => {
            isComposingRef.current = false;
        }, 0);
    }, []);

    const onSend = useCallback(() => {
        if (!input.trim() || isGenerating) return;
        setIsGenerating(true);
    }, [input, isGenerating]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        // 双重检查：原生 isComposing + 自定义 ref（兼容 Safari）
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && !isComposingRef.current) {
            e.preventDefault();
            setIsGenerating(true);
        }
    }, [isGenerating]);

    return (
        <>
            <TextareaAutosize
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={onCompositionStart}
                onCompositionEnd={onCompositionEnd}
                placeholder="随心输入"
                minRows={2}
                maxRows={7}
                disabled={isGenerating}
                className="w-full resize-none bg-transparent px-3.25 pt-3 pb-1 text-sm text-[#e6e2e3] placeholder:text-[#6b6b6b] outline-none"
            />
            <div className="flex items-center px-2.25 pb-[7.5px]">
                <button className="p-1.5 rounded-full text-[#969696] hover:bg-[#373737] disabled:cursor-not-allowed transition-all duration-200">
                    <Plus className="w-4 h-4" />
                </button>

                <Dropdown open={modelDropdownOpen} onOpenChange={setModelDropdownOpen} className="ml-auto">
                    <DropdownTrigger className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-[#b0b0b0] hover:bg-[#373737] hover:text-[#e6e2e3] transition-all duration-200">
                        <DeepSeek className="w-4 h-4" />
                        <span>{MODELS.find((m) => m.id === model)?.label}</span>
                        <ChevronDown className="w-3 h-3 opacity-60" />
                    </DropdownTrigger>
                    <DropdownContent
                        className="min-w-54 bg-[#2a2a2b]/65 backdrop-blur-xl border border-[#373737] rounded-xl p-1 shadow-xl animate-in fade-in zoom-in-95 duration-150"
                        activeIndex={MODELS.findIndex((m) => m.id === model)}
                        align="end"
                    >
                        {MODELS.map((m) => (
                            <DropdownItem
                                key={m.id}
                                onClick={() => {
                                    setModel(m.id);
                                    setModelDropdownOpen(false);
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-xs text-[#e6e2e3] hover:bg-white/5 rounded-lg cursor-pointer focus:bg-white/10"
                            >
                                <DeepSeek className="w-4 h-4" />
                                <span className="flex-1">{m.label}</span>
                                {m.id === model && (
                                    <Check className="w-3.5 h-3.5 text-[#e6e2e3]" />
                                )}
                            </DropdownItem>
                        ))}
                    </DropdownContent>
                </Dropdown>

                <button
                    onClick={onSend}
                    disabled={!input.trim() || isGenerating}
                    className="p-1.5 ml-3 rounded-full bg-[#e6e2e3] text-[#1e1e1f] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ArrowUp className="w-4 h-4" />
                </button>
            </div>
        </>
    );
});
