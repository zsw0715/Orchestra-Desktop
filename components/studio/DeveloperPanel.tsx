"use client";

import { memo, useState } from "react";
import { ChevronLeft, ChevronRight, X, Bug } from "lucide-react";
import { useWorkflow } from "@/context/WorkflowContext";

const DeveloperPanel = memo(() => {
    const [visible, setVisible] = useState(true);
    const { buildStep, revealNext, revealPrev } = useWorkflow();

    return (
        <div className="absolute top-8 right-3 z-50">
            {visible ? (
                <div className="flex items-center gap-0.5 bg-neutral-800/70 backdrop-blur-sm rounded-xl border border-neutral-700 p-1">
                    <button
                        onClick={revealPrev}
                        disabled={buildStep <= 0}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-700/60 text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Step Back"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={revealNext}
                        disabled={buildStep >= 5}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-700/60 text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Step Forward"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-neutral-700 mx-0.5" />
                    <button
                        onClick={() => setVisible(false)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-700/60 text-neutral-500 hover:text-neutral-300 transition-colors"
                        title="Close"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setVisible(true)}
                    className="w-9.25 h-9.25 flex items-center justify-center rounded-xl bg-neutral-800/70 backdrop-blur-sm border border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 transition-colors"
                    title="Open Debug Panel"
                >
                    <Bug className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
});

DeveloperPanel.displayName = "DeveloperPanel";

export default DeveloperPanel;
