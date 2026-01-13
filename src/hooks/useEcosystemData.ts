import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Partner } from "@/types/ecosystem";

// Updated CSV URL provided by user (Latest)
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

export const useEcosystemData = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

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

                            // New Sheet Columns: Category, Parent Category
                            if (row["Category"]) categories.push(row["Category"]);
                            if (row["Parent Category"]) categories.push(row["Parent Category"]);

                            // Fallback: Checkbox Columns (D-K) logic preserved just in case
                            Object.keys(row).forEach(key => {
                                const value = row[key]?.toString().trim().toUpperCase();
                                if (["PARTNER", "NAME", "DESCRIPTION", "WEBSITE", "URL", "TWITTER", "X", "STATUS", "CATEGORY", "PARENT CATEGORY", "LOGO", "X HANDLE", "ADDITIONAL NOTES"].includes(key.toUpperCase())) return;
                                if (value === "TRUE") categories.push(key);
                            });

                            // Deduplicate
                            categories = Array.from(new Set(categories));
                            if (categories.length === 0) categories.push("Uncategorized");

                            const websiteUrl = row["Website"] || row["WebsiteURL"] || row["websiteUrl"] || "";
                            let finalLogoUrl = row["LogoURL"] || row["logoUrl"] || "";

                            // If no logo provided, try to use favicon from website
                            if (!finalLogoUrl && websiteUrl) {
                                try {
                                    const urlObj = new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`);
                                    finalLogoUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
                                } catch (e) {
                                    // Invalid URL, ignore
                                }
                            }

                            return {
                                name: row["Partner"] || row["Name"] || row["name"],
                                description: row["Description"] || row["description"] || "",
                                logoUrl: finalLogoUrl,
                                categories: categories,
                                status: row["Status"] || row["status"] || row["Deployment Status"],
                                xHandle: row["Twitter"] || row["X Handle"] || row["XHandle"] || row["xHandle"],
                                websiteUrl: websiteUrl,
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

    return { partners, loading };
};
