"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownContent = memo(function MarkdownContent({ content }: { content: string }) {
    return (
        <div className="text-sm leading-relaxed text-[#d4d4d4] space-y-2">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkGemoji, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                    h1: ({ children })  => <h1 className="text-lg font-medium text-[#e6e2e3] mt-4 mb-2">{children}</h1>,
                    h2: ({ children })  => <h2 className="text-base font-medium text-[#e6e2e3] mt-4 mb-2">{children}</h2>,
                    h3: ({ children })  => <h3 className="text-sm font-medium text-[#e6e2e3] mt-3 mb-1">{children}</h3>,
                    p: ({ children })   => <p className="my-1.5">{children}</p>,
                    strong: ({ children }) => <strong className="text-[#e6e2e3] font-medium">{children}</strong>,
                    a: ({ href, children }) => (
                        <a href={href} className="text-[#ad7bf9] no-underline hover:underline" target="_blank" rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside my-1.5 space-y-0.5">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside my-1.5 space-y-0.5">{children}</ol>,
                    li: ({ children }) => <li className="marker:text-[#6b6b6b] [&>p]:my-0 [&>p:first-child]:inline">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-[#ad7bf9] pl-3 my-2 text-[#b0b0b0] italic">{children}</blockquote>
                    ),
                    hr: () => <hr className="border-[#2b2b2b] my-3" />,
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-2 rounded-lg border border-[#2b2b2b]">
                            <table className="min-w-full w-full text-xs border-collapse">{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className="bg-[#1e1e1f]">{children}</thead>,
                    th: ({ children }) => <th className="px-3 py-1.5 text-left text-[#e6e2e3] font-medium border-b border-[#2b2b2b]">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-1.5 border-b border-[#2b2b2b] last:border-b-0">{children}</td>,
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const codeText = String(children).replace(/\n$/, "");

                        return match ? (
                            <div className="rounded-lg border border-[#2b2b2b] overflow-hidden my-2 bg-[#181818]">
                                <div className="flex items-center justify-between px-4 py-1.5 bg-[#1e1e1f] border-b border-[#2b2b2b]">
                                    <span className="text-[11px] text-[#969696] uppercase tracking-wide">{match[1]}</span>
                                </div>
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    codeTagProps={{
                                        style: { background: "transparent" },
                                    }}
                                    customStyle={{
                                        margin: 0,
                                        padding: "0.75rem 1rem",
                                        background: "transparent",
                                        fontSize: "0.75rem",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    {codeText}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className="text-[#e6e2e3] bg-[#2a2a2b] px-1 py-0.5 rounded text-xs" {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
});

export default MarkdownContent;
