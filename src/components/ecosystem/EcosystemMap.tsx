"use client";

import { useEcosystemData } from "@/hooks/useEcosystemData";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Partner } from "@/types/ecosystem";
import { ExternalLink, Twitter, Globe, Info } from "lucide-react";

export const EcosystemMap = () => {
    const { partners, loading } = useEcosystemData();
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [hoveredPartner, setHoveredPartner] = useState<Partner | null>(null);

    // Configuration
    const VIEWBOX_SIZE = 1200; // -600 to +600
    const CATEGORY_RADIUS = 280;
    const PARTNER_RADIUS = 480;

    // Provided Logo URL
    const HEMI_LOGO_URL = "https://docs.hemi.xyz/~gitbook/image?url=https%3A%2F%2F3063395300-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FBrGAUP9hcnvqWQvHZlN0%252Fuploads%252FLX3CiOZO55TpQknuT66S%252FHemi%2520-%2520Logo%2520-%2520Icon%2520-%2520Orange.png%3Falt%3Dmedia%26token%3Dd2eca30d-0260-47f2-b619-a16c20e21b14&width=768&dpr=1&quality=100&sign=8dc9bc48&sv=2";

    const data = useMemo(() => {
        const groups: Record<string, typeof partners> = {};

        partners.forEach(partner => {
            const primaryCategory = partner.categories[0] || "Uncategorized";
            if (!groups[primaryCategory]) groups[primaryCategory] = [];
            groups[primaryCategory].push(partner);
        });

        const categories = Object.keys(groups).sort();
        return { groups, categories };
    }, [partners]);

    if (loading) {
        return (
            <div className="flex bg-black h-[80vh] w-full items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
        );
    }

    const getPosition = (angleDegrees: number, radius: number) => {
        const radian = (angleDegrees * Math.PI) / 180;
        return {
            x: radius * Math.cos(radian - Math.PI / 2),
            y: radius * Math.sin(radian - Math.PI / 2)
        };
    };

    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-black text-white flex items-center justify-center">

            {/* Interactive Overlay / Tooltip */}
            <AnimatePresence>
                {hoveredPartner && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-8 right-8 z-50 w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="h-14 w-14 rounded-xl bg-black border border-white/10 overflow-hidden flex-shrink-0 p-1">
                                <img
                                    src={hoveredPartner.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(hoveredPartner.name)}&background=random`}
                                    className="h-full w-full object-contain rounded-lg"
                                    onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hoveredPartner.name)}&background=random`)}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">{hoveredPartner.name}</h3>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-medium">
                                    {hoveredPartner.categories[0]}
                                </span>
                            </div>
                        </div>

                        {hoveredPartner.description && (
                            <p className="text-sm text-zinc-400 mb-4 leading-relaxed line-clamp-4">
                                {hoveredPartner.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3 mt-auto">
                            {hoveredPartner.websiteUrl && (
                                <a
                                    href={hoveredPartner.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-colors"
                                >
                                    <Globe size={14} className="text-zinc-400" />
                                    Website
                                </a>
                            )}
                            {hoveredPartner.xHandle && (
                                <a
                                    href={hoveredPartner.xHandle.startsWith("http") ? hoveredPartner.xHandle : `https://x.com/${hoveredPartner.xHandle.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-colors"
                                >
                                    <Twitter size={14} className="text-zinc-400" />
                                    {hoveredPartner.xHandle.replace("https://twitter.com/", "@").replace("https://x.com/", "@")}
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <svg
                className="w-full h-full max-w-[1000px] max-h-[1000px] pointer-events-auto"
                viewBox={`-${VIEWBOX_SIZE / 2} -${VIEWBOX_SIZE / 2} ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
                preserveAspectRatio="xMidYMid meet"
                onMouseLeave={() => {
                    setHoveredCategory(null);
                    setHoveredPartner(null);
                }}
            >
                <style>
                    {`
                        .hover-trigger:hover { cursor: pointer; }
                    `}
                </style>

                <defs>
                    <radialGradient id="centerGradient" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* --- Connections (Layer 0) --- */}
                {data.categories.map((cat, i) => {
                    const catAngle = (i * 360) / data.categories.length;
                    const catPos = getPosition(catAngle, CATEGORY_RADIUS);

                    const isCatHovered = hoveredCategory === cat;
                    const isDimmed = (hoveredCategory && !isCatHovered) || (hoveredPartner && hoveredPartner.categories[0] !== cat);

                    return (
                        <g key={`lines-${cat}`} style={{ opacity: isDimmed ? 0.1 : 1, transition: 'opacity 0.3s' }}>
                            {/* Line from Center to Category */}
                            <line
                                x1={0}
                                y1={0}
                                x2={catPos.x}
                                y2={catPos.y}
                                stroke="#f97316"
                                strokeWidth={isCatHovered ? 4 : 2}
                                strokeOpacity={isCatHovered ? 0.8 : 0.2}
                                className="transition-all duration-300"
                            />

                            {/* Lines from Category to Partners */}
                            {data.groups[cat].map((partner, j) => {
                                const numPartners = data.groups[cat].length;
                                const spreadAngle = 45;
                                const startAngle = catAngle - (spreadAngle / 2);
                                const step = spreadAngle / (numPartners > 1 ? numPartners - 1 : 1);
                                const pAngle = numPartners === 1 ? catAngle : startAngle + (step * j);
                                const pPos = getPosition(pAngle, PARTNER_RADIUS);

                                const isPartnerHovered = hoveredPartner?.name === partner.name;

                                return (
                                    <line
                                        key={`line-${partner.name}`}
                                        x1={catPos.x}
                                        y1={catPos.y}
                                        x2={pPos.x}
                                        y2={pPos.y}
                                        stroke={isPartnerHovered ? "#f97316" : "#52525b"}
                                        strokeWidth={isPartnerHovered ? 2 : 1}
                                        strokeOpacity={isPartnerHovered ? 0.8 : 0.2}
                                        className="transition-all duration-300"
                                    />
                                );
                            })}
                        </g>
                    );
                })}

                {/* --- Central Hub (Layer 1) --- */}
                <g className="filter drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                    <circle cx="0" cy="0" r="60" fill="black" stroke="#f97316" strokeWidth="2" />
                    <image
                        href={HEMI_LOGO_URL}
                        x="-35"
                        y="-35"
                        height="70"
                        width="70"
                        className="pointer-events-none"
                    />
                </g>

                {/* --- Category Nodes (Layer 2) --- */}
                {data.categories.map((cat, i) => {
                    const catAngle = (i * 360) / data.categories.length;
                    const { x, y } = getPosition(catAngle, CATEGORY_RADIUS);

                    const isHovered = hoveredCategory === cat;
                    const isDimmed = (hoveredCategory && !isHovered) || (hoveredPartner && hoveredPartner.categories[0] !== cat);

                    return (
                        <g
                            key={cat}
                            transform={`translate(${x}, ${y})`}
                            onMouseEnter={() => setHoveredCategory(cat)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            className="hover-trigger"
                            style={{ opacity: isDimmed ? 0.3 : 1, transition: 'all 0.3s' }}
                        >
                            {/* Glow */}
                            <circle r={isHovered ? 50 : 40} fill="black" fillOpacity="0.9" className="transition-all duration-300" />
                            <circle
                                r={isHovered ? 50 : 40}
                                stroke="#f97316"
                                strokeWidth={isHovered ? 3 : 1}
                                strokeOpacity={isHovered ? 1 : 0.5}
                                fill="none"
                                className="transition-all duration-300"
                            />

                            {/* Text Label */}
                            <foreignObject x="-60" y="-15" width="120" height="30">
                                <div className="flex items-center justify-center h-full w-full">
                                    <span className={`text-white text-xs font-bold text-center px-2 py-0.5 rounded backdrop-blur-md transition-all duration-300 ${isHovered ? 'bg-orange-500 scale-110' : 'bg-black/50 border border-white/10'}`}>
                                        {cat}
                                    </span>
                                </div>
                            </foreignObject>
                        </g>
                    );
                })}


                {/* --- Partner Nodes (Layer 3) --- */}
                {data.categories.map((cat, i) => {
                    const catAngle = (i * 360) / data.categories.length;

                    return data.groups[cat].map((partner, j) => {
                        const numPartners = data.groups[cat].length;
                        const spreadAngle = 45;
                        const startAngle = catAngle - (spreadAngle / 2);
                        const step = spreadAngle / (numPartners > 1 ? numPartners - 1 : 1);
                        const pAngle = numPartners === 1 ? catAngle : startAngle + (step * j);

                        const { x, y } = getPosition(pAngle, PARTNER_RADIUS);
                        const isHovered = hoveredPartner?.name === partner.name;
                        const isDimmed = (hoveredCategory && hoveredCategory !== cat) || (hoveredPartner && !isHovered);

                        return (
                            <a
                                key={partner.name}
                                href={partner.websiteUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover-trigger"
                                onMouseEnter={() => setHoveredPartner(partner)}
                                onMouseLeave={() => setHoveredPartner(null)}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <g
                                    transform={`translate(${x}, ${y})`}
                                    style={{ opacity: isDimmed ? 0.2 : 1, transition: 'all 0.3s' }}
                                >
                                    <circle
                                        r={isHovered ? 28 : 18}
                                        fill="#18181b"
                                        stroke={isHovered ? "#f97316" : "#3f3f46"}
                                        strokeWidth={isHovered ? 2 : 1}
                                        className="transition-all duration-300"
                                    />

                                    {/* Partner Logo */}
                                    <image
                                        href={partner.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=18181b&color=fff`}
                                        x={isHovered ? "-24" : "-16"}
                                        y={isHovered ? "-24" : "-16"}
                                        width={isHovered ? "48" : "32"}
                                        height={isHovered ? "48" : "32"}
                                        className="rounded-full transition-all duration-300"
                                        clipPath={`circle(${isHovered ? 24 : 16}px at ${isHovered ? 24 : 16}px ${isHovered ? 24 : 16}px)`}
                                    />
                                </g>
                            </a>
                        );
                    });
                })}
            </svg>
        </div>
    );
};
