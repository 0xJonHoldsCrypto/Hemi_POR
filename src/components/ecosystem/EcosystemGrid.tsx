"use client";

import { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import { Partner } from "@/types/ecosystem";
import { PartnerCard } from "./PartnerCard";
import { FilterBar } from "./FilterBar";
import { Search } from "lucide-react";

// Updated CSV URL provided by user
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYuVHXQ1IwQYDLF3l9wKsGsDeaeHEyT9civJKBHxtqAwIym7saSNobbCDANaA-lpjF5BZ6LONSAN_-/pub?gid=1320772788&single=true&output=csv";

// Fallback mock data structure updated to match new type
const MOCK_DATA: Partner[] = [
    {
        name: "Hemi Labs",
        description: "The core contributors to the Hemi Network.",
        logoUrl: "https://pbs.twimg.com/profile_images/1818282717978050561/0fJqfU6q_400x400.jpg",
        categories: ["Core", "L2"],
        status: "Live",
        xHandle: "@hemi_xyz",
        websiteUrl: "https://hemi.xyz",
    },
    {
        name: "Bitcoin",
        description: "The decentralized digital currency.",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg",
        categories: ["Infrastructure"],
        status: "Live",
        websiteUrl: "https://bitcoin.org",
    },
];

export const EcosystemGrid = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(GOOGLE_SHEET_CSV_URL);
                if (!response.ok) throw new Error("Failed to fetch CSV");
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const parsed = results.data.map((row: any) => {
                            // Determine Categories
                            let categories: string[] = [];

                            // 1. Try "Category" and "Parent Category" columns
                            if (row["Category"]) categories.push(row["Category"]);
                            if (row["Parent Category"]) categories.push(row["Parent Category"]);

                            // 2. Try Checkbox Columns (D-K) based on user description
                            Object.keys(row).forEach(key => {
                                const value = row[key]?.toString().trim().toUpperCase();
                                // Avoid standard columns
                                if (["PARTNER", "NAME", "DESCRIPTION", "WEBSITE", "URL", "TWITTER", "X", "STATUS", "CATEGORY", "PARENT CATEGORY", "LOGO", "X HANDLE", "ADDITIONAL NOTES"].includes(key.toUpperCase())) return;

                                if (value === "TRUE") {
                                    categories.push(key);
                                }
                            });

                            // Deduplicate categories
                            categories = Array.from(new Set(categories));
                            if (categories.length === 0) categories.push("Uncategorized");

                            return {
                                name: row["Partner"] || row["Name"] || row["name"],
                                description: row["Description"] || row["description"] || "",
                                logoUrl: row["LogoURL"] || row["logoUrl"] || "",
                                categories: categories,
                                status: row["Status"] || row["status"] || row["Deployment Status"],
                                // Fixed: Added support for "X Handle" (with space)
                                xHandle: row["X Handle"] || row["Twitter"] || row["XHandle"] || row["xHandle"],
                                websiteUrl: row["Website"] || row["WebsiteURL"] || row["websiteUrl"],
                            };
                        }).filter((p: any) => p.name);

                        if (parsed.length > 0) {
                            setPartners(parsed as Partner[]);
                        } else {
                            setPartners(MOCK_DATA);
                        }
                        setLoading(false);
                    },
                    error: (err: any) => {
                        console.error("CSV Parse Error:", err);
                        setPartners(MOCK_DATA);
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.warn("Using mock data due to fetch error:", error);
                setPartners(MOCK_DATA);
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const categories = useMemo(() => {
        const allCategories = partners.flatMap((p) => p.categories);
        const uniqueCategories = Array.from(new Set(allCategories)).sort();

        return uniqueCategories.map(cat => ({
            name: cat,
            count: partners.filter(p => p.categories.includes(cat)).length
        }));
    }, [partners]);

    const filteredPartners = useMemo(() => {
        return partners.filter((p) => {
            // 1. Category Filter
            const matchesCategory = selectedCategory === "All" || p.categories.includes(selectedCategory);

            // 2. Search Filter
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.categories.some(c => c.toLowerCase().includes(query));

            return matchesCategory && matchesSearch;
        });
    }, [partners, selectedCategory, searchQuery]);

    return (
        <div className="w-full">
            <div className="flex justify-center mb-12">
                <span className="inline-flex items-center gap-3 rounded-full border border-orange-500/30 bg-orange-500/15 px-6 py-2.5 text-base font-semibold text-orange-500 backdrop-blur-sm transition-all hover:bg-orange-500/20 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 cursor-default">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                    {partners.length} Partners and Growing
                </span>
            </div>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <FilterBar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    totalCount={partners.length}
                />

                <div className="relative w-full sm:w-72">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-zinc-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search partners..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredPartners.map((partner, idx) => (
                        <PartnerCard key={`${partner.name}-${idx}`} partner={partner} />
                    ))}
                </div>
            )}

            {!loading && filteredPartners.length === 0 && (
                <div className="py-20 text-center text-zinc-500">
                    No partners found matching your criteria.
                </div>
            )}
        </div>
    );
};
