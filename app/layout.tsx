import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import { SidebarProvider } from "@/context/SidebarContext";
import { WorkflowProvider } from "@/context/WorkflowContext";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Orchestra Desktop",
    description: "Orchestra Desktop",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
            suppressHydrationWarning
        >
            <body className="h-full flex flex-col bg-[#1e1e1f]/45 p-1 overflow-hidden">
                <WorkflowProvider>
                    <SidebarProvider>
                        {children}
                    </SidebarProvider>
                </WorkflowProvider>
            </body>
        </html>
    );
}
