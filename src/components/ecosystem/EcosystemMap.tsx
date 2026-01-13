"use client";

import { useEcosystemData } from "@/hooks/useEcosystemData";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Partner } from "@/types/ecosystem";
import { ExternalLink, Twitter, Globe, Info, X } from "lucide-react";

export const EcosystemMap = () => {
    const { partners, loading } = useEcosystemData();
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [hoveredPartner, setHoveredPartner] = useState<Partner | null>(null);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

    // Configuration - Satellite Cluster Layout
    const VIEWBOX_SIZE = 2400;
    const CATEGORY_ORBIT_RADIUS = 750; // Distance of Category from Center (pushed out)
    const PARTNER_ORBIT_RADIUS = 220;  // Distance of Partner from Category

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
            <div className="flex bg-black h-screen w-full items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
        );
    }

    // Helper: Position on global circle (for Categories)
    // 0 degrees is UP (due to -PI/2)
    const getCategoryPosition = (angleDegrees: number, radius: number) => {
        const radian = (angleDegrees * Math.PI) / 180;
        return {
            x: radius * Math.cos(radian - Math.PI / 2),
            y: radius * Math.sin(radian - Math.PI / 2)
        };
    };

    // Helper: Position relative to a center point (for Partners orbiting Categories)
    const getSatellitePosition = (cx: number, cy: number, angleDegrees: number, radius: number) => {
        const radian = (angleDegrees * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(radian - Math.PI / 2), // Consistent rotation origin
            y: cy + radius * Math.sin(radian - Math.PI / 2)
        };
    };

    // Active partner is either selected (locked) or hovered (preview)
    const activePartner = selectedPartner || hoveredPartner;

    return (
        <div className="absolute inset-0 h-full w-full overflow-hidden bg-black text-white flex items-center justify-center">

            {/* Interactive Overlay / Tooltip */}
            <AnimatePresence mode="wait">
                {activePartner && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-8 right-8 z-50 w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    >
                        {/* Close button */}
                        {selectedPartner && (
                            <button
                                onClick={() => setSelectedPartner(null)}
                                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}

                        <div className="flex items-start gap-4 mb-4">
                            <div className="h-20 w-20 rounded-xl bg-black border border-white/10 overflow-hidden flex-shrink-0 p-1">
                                <img
                                    src={activePartner.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(activePartner.name)}&background=random`}
                                    className="h-full w-full object-contain rounded-lg"
                                    onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activePartner.name)}&background=random`)}
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white leading-tight pr-6">{activePartner.name}</h3>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-medium">
                                    {activePartner.categories[0]}
                                </span>
                            </div>
                        </div>

                        {activePartner.description && (
                            <p className="text-sm text-zinc-400 mb-6 leading-relaxed line-clamp-4">
                                {activePartner.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3 mt-auto">
                            {activePartner.websiteUrl && (
                                <a
                                    href={activePartner.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-sm font-medium text-white transition-colors shadow-lg shadow-orange-500/20"
                                >
                                    <Globe size={16} />
                                    Visit
                                </a>
                            )}
                            {activePartner.xHandle && (
                                <a
                                    href={activePartner.xHandle.startsWith("http") ? activePartner.xHandle : `https://x.com/${activePartner.xHandle.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-colors"
                                >
                                    <Twitter size={16} className="text-zinc-400" />
                                    Twitter
                                </a>
                            )}
                        </div>

                        {!selectedPartner && (
                            <div className="mt-3 text-[10px] text-zinc-600 font-medium text-center uppercase tracking-widest">
                                Click to lock
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <svg
                className="w-full h-full pointer-events-auto"
                viewBox={`-${VIEWBOX_SIZE / 2} -${VIEWBOX_SIZE / 2} ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
                preserveAspectRatio="xMidYMid meet"
                onMouseLeave={() => {
                    setHoveredCategory(null);
                    setHoveredPartner(null);
                }}
                onClick={() => {
                    setSelectedPartner(null);
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
                    const catPos = getCategoryPosition(catAngle, CATEGORY_ORBIT_RADIUS);

                    const isCatHovered = hoveredCategory === cat;
                    const isDimmed = (hoveredCategory && !isCatHovered) || (activePartner && activePartner.categories[0] !== cat);

                    return (
                        <g key={`lines-${cat}`} style={{ opacity: isDimmed ? 0.1 : 1, transition: 'opacity 0.3s' }}>
                            {/* Line from Center to Category */}
                            <line
                                x1={0}
                                y1={0}
                                x2={catPos.x}
                                y2={catPos.y}
                                stroke="#f97316"
                                strokeWidth={isCatHovered ? 3 : 1.5}
                                strokeOpacity={isCatHovered ? 0.6 : 0.15}
                                strokeDasharray={isCatHovered ? "none" : "5,5"}
                                className="transition-all duration-300"
                            />

                            {/* Lines from Category to Partners (Satellites) */}
                            {data.groups[cat].map((partner, j) => {
                                const numPartners = data.groups[cat].length;
                                // Distribute partners in a full circle around the category
                                const pAngle = (j * 360) / numPartners;
                                const pPos = getSatellitePosition(catPos.x, catPos.y, pAngle, PARTNER_ORBIT_RADIUS);

                                const isActive = activePartner?.name === partner.name;

                                return (
                                    <line
                                        key={`line-${partner.name}`}
                                        x1={catPos.x}
                                        y1={catPos.y}
                                        x2={pPos.x}
                                        y2={pPos.y}
                                        stroke={isActive ? "#f97316" : "#52525b"}
                                        strokeWidth={isActive ? 2 : 1}
                                        strokeOpacity={isActive ? 0.8 : 0.2}
                                        className="transition-all duration-300"
                                    />
                                );
                            })}
                        </g>
                    );
                })}

                {/* --- Central Hub (Layer 1) --- */}
                <g className="filter drop-shadow-[0_0_30px_rgba(249,115,22,0.6)]">
                    <circle cx="0" cy="0" r="80" fill="black" stroke="#f97316" strokeWidth="2" />
                    <image
                        href={HEMI_LOGO_URL}
                        x="-45"
                        y="-45"
                        height="90"
                        width="90"
                        className="pointer-events-none"
                    />
                </g>

                {/* --- Category Nodes (Layer 2) --- */}
                {data.categories.map((cat, i) => {
                    const catAngle = (i * 360) / data.categories.length;
                    const { x, y } = getCategoryPosition(catAngle, CATEGORY_ORBIT_RADIUS);

                    const isHovered = hoveredCategory === cat;
                    const isDimmed = (hoveredCategory && !isHovered) || (activePartner && activePartner.categories[0] !== cat);

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
                            <circle r={isHovered ? 80 : 70} fill="black" fillOpacity="0.8" className="transition-all duration-300" />
                            <circle
                                r={isHovered ? 80 : 70}
                                stroke={isHovered ? "#f97316" : "#27272a"}
                                strokeWidth={isHovered ? 2 : 1}
                                strokeDasharray={isHovered ? "none" : "4 4"}
                                fill="none"
                                className="transition-all duration-300"
                            />

                            {/* Text Label - INCREASED SIZE TO 2XL */}
                            <foreignObject x="-125" y="-35" width="250" height="70">
                                <div className="flex items-center justify-center h-full w-full">
                                    <span className={`text-white text-2xl font-bold text-center px-6 py-2 rounded-full backdrop-blur-md transition-all duration-300 ${isHovered ? 'bg-orange-500 scale-110 shadow-lg' : 'bg-black/80 border border-white/10'}`}>
                                        {cat}
                                    </span>
                                </div>
                            </foreignObject>
                        </g>
                    );
                })}


                {/* --- Partner Nodes (Satellites) (Layer 3) --- */}
                {data.categories.map((cat, i) => {
                    const catAngle = (i * 360) / data.categories.length;
                    const catPos = getCategoryPosition(catAngle, CATEGORY_ORBIT_RADIUS);

                    return data.groups[cat].map((partner, j) => {
                        const numPartners = data.groups[cat].length;
                        const pAngle = (j * 360) / numPartners;
                        const { x, y } = getSatellitePosition(catPos.x, catPos.y, pAngle, PARTNER_ORBIT_RADIUS);

                        const isActive = activePartner?.name === partner.name;
                        const isSelected = selectedPartner?.name === partner.name;
                        const isDimmed = (hoveredCategory && hoveredCategory !== cat) || (activePartner && !isActive);

                        // Balanced sizes
                        const BASE_SIZE = 30;
                        const HOVER_SIZE = 45;
                        const CURRENT_SIZE = isActive ? HOVER_SIZE : BASE_SIZE;

                        return (
                            <g
                                key={partner.name}
                                className="hover-trigger cursor-pointer"
                                onMouseEnter={() => setHoveredPartner(partner)}
                                onMouseLeave={() => setHoveredPartner(null)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedPartner(partner);
                                }}
                                transform={`translate(${x}, ${y})`}
                                style={{ opacity: isDimmed ? 0.2 : 1, transition: 'all 0.3s' }}
                            >
                                {/* Selection Ring */}
                                {isSelected && (
                                    <circle
                                        r={HOVER_SIZE + 8}
                                        fill="none"
                                        stroke="#f97316"
                                        strokeWidth="2"
                                        strokeDasharray="4 4"
                                        className="animate-spin-slow"
                                    >
                                        <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
                                    </circle>
                                )}

                                <circle
                                    r={CURRENT_SIZE}
                                    fill="#18181b"
                                    stroke={isActive ? "#f97316" : "#27272a"}
                                    strokeWidth={isActive ? 2 : 1}
                                    className="transition-all duration-300"
                                />

                                <image
                                    href={partner.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=18181b&color=fff`}
                                    x={-CURRENT_SIZE}
                                    y={-CURRENT_SIZE}
                                    width={CURRENT_SIZE * 2}
                                    height={CURRENT_SIZE * 2}
                                    className="transition-all duration-300"
                                    style={{ clipPath: 'circle(50%)' }} // CSS clip-path for perfect circular mask
                                />
                            </g>
                        );
                    });
                })}
            </svg>
        </div>
    );
};
