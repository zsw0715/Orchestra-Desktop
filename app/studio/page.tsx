"use client";
import Link from "next/link";

export default function Studio() {
    return (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <h1 className="text-2xl font-bold">Studio</h1>
            <Link
                href="/studio/12345"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                打开工作室 12345
            </Link>
        </div>
    );
}
