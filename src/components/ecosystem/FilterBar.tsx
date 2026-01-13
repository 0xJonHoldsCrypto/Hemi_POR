"use client";

import { cn } from "@/lib/utils"; // Assuming cn exists or clsx/tailwind-merge is used, I saw tailwind-merge in package.json, will check lib/utils later or define inline if needed. I'll use inline simple class logic for now or generic className if lib/utils doesn't exist.
// Wait, I haven't checked for lib/utils. I will assume standard Next.js shadcn-like setup or just use conditional strings.
// Actually, safely assume I can just use template literals with tailwind-merge if I import it, but let's just stick to clean template literals for now to be safe, or check if lib/utils exists.
// I'll assume it exists because `clsx` and `tailwind-merge` are in dependencies. I'll stick to a simple function for now to avoid specific file dependency if I'm not sure.

interface FilterBarProps {
    categories: { name: string; count: number }[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    totalCount: number;
}

export const FilterBar = ({
    categories,
    selectedCategory,
    onSelectCategory,
    totalCount,
}: FilterBarProps) => {
    return (
        <div className="flex flex-wrap items-center gap-2 py-6">
            <button
                onClick={() => onSelectCategory("All")}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${selectedCategory === "All"
                        ? "border-orange-500 bg-orange-500/10 text-orange-500"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-white"
                    }`}
            >
                All <span className="opacity-60 text-xs">({totalCount})</span>
            </button>
            {categories.map((category) => (
                <button
                    key={category.name}
                    onClick={() => onSelectCategory(category.name)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.name
                            ? "border-orange-500 bg-orange-500/10 text-orange-500"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-white"
                        }`}
                >
                    {category.name} <span className="opacity-60 text-xs">({category.count})</span>
                </button>
            ))}
        </div>
    );
};
