"use client";

import { memo, useState } from "react";
import { ChevronLeft, ChevronRight, X, Bug } from "lucide-react";

const DeveloperPanel = memo(() => {
    const [visible, setVisible] = useState(true);

    return (
        <div className="absolute top-12 right-3 z-50">
            {visible ? (
                <div className="flex items-center gap-0.5 bg-neutral-800/70 backdrop-blur-sm rounded-xl border border-neutral-700 p-1">
                    <button
                        onClick={() => {/* TODO: step back */}}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-700/60 text-neutral-400 hover:text-neutral-200 transition-colors"
                        title="Step Back"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {/* TODO: step forward */}}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-700/60 text-neutral-400 hover:text-neutral-200 transition-colors"
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
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-800/70 backdrop-blur-sm border border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 transition-colors"
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
