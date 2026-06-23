"use client";

import { Gauge, CalendarSync, Workflow, Puzzle, Cpu, Key, Settings } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex-1 overflow-hidden rounded-[12.5px] bg-[#181818]/35">
            {/* 可拖动标题栏 */}
            <div className={`absolute top-0 left-0 w-full h-8 cursor-grabbing`} data-tauri-drag-region />
            <div className="flex flex-row h-[calc(100vh-7.5px)] transition-transform duration-500 ease-out">
                {/* left side */}
                <div className="w-64 h-full mt-12 flex flex-col px-1.5 gap-5 overflow-y-auto">
                    {/* Dashboard */}
                    <Link href="/" className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-neutral-800/60 text-neutral-200 cursor-pointer shadow-md border border-neutral-400/25">
                        <Gauge className="w-4 h-4" />
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>

                    {/* Build */}
                    <div>
                        <span className="block px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                            Build
                        </span>
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30 transition-colors">
                            <CalendarSync className="w-4 h-4" />
                            <span className="text-sm">Automation</span>
                        </div>
                        <Link href="/studio" className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30 transition-colors">
                            <Workflow className="w-4 h-4" />
                            <span className="text-sm">Orchestra Studio</span>
                        </Link>
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30 transition-colors">
                            <Puzzle className="w-4 h-4" />
                            <span className="text-sm">Tool Integration</span>
                        </div>
                    </div>

                    {/* Operate */}
                    <div>
                        <span className="block px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                            Operate
                        </span>
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30 transition-colors">
                            <Cpu className="w-4 h-4" />
                            <span className="text-sm">LLM Configuration</span>
                        </div>
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30 transition-colors">
                            <Key className="w-4 h-4" />
                            <span className="text-sm">Environmental Variable</span>
                        </div>
                    </div>

                    {/* Manage */}
                    <div>
                        <span className="block px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                            Manage
                        </span>
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30 transition-colors">
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">Settings</span>
                        </div>
                    </div>
                </div>
                {/* right side */}
                <div className="flex-1 flex flex-col">
                    {/* title */}
                    <div className="w-full h-12 flex items-end pb-1.5 ml-8 font-bold text-lg text-white/70">
                        Dashboard
                    </div>
                    {/* operation area */}
                    <div className="flex-1 flex justify-center items-center rounded-tl-3xl rounded-tr-xl  rounded-br-[12.5px] bg-linear-to-br from-neutral-800 to-neutral-900 border border-b-0 border-r-0 border-neutral-500/20 shadow-[0_0_25px_rgba(35,35,35,0.35)]">
                        <div
                            className="absolute px-13 py-5 mt-px bg-neutral-200/90 text-neutral-900 rounded-2xl blur-3xl font-medium text-sm"
                        >
                            This is the Dashboard
                        </div>
                        <div className="absolute flex justify-center items-center font-bold font-mono text-white/75">
                            This is the Dashboard
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
