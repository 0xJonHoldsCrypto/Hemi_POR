"use client";

import { Partner } from "@/types/ecosystem";
import { ExternalLink, Globe } from "lucide-react";
import { useState, useEffect } from "react";

interface PartnerCardProps {
    partner: Partner;
}


export const PartnerCard = ({ partner }: PartnerCardProps) => {
    const [imgSrc, setImgSrc] = useState<string>("");

    useEffect(() => {
        let initialSrc = "";
        if (partner.logoUrl) {
            initialSrc = partner.logoUrl;
        } else if (partner.websiteUrl) {
            try {
                const domain = new URL(partner.websiteUrl).hostname;
                initialSrc = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            } catch {
                initialSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random`;
            }
        } else {
            initialSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random`;
        }
        setImgSrc(initialSrc);
    }, [partner.logoUrl, partner.websiteUrl, partner.name]);

    const handleError = () => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random`;
        // If the current image that failed was the logoUrl, try the favicon
        if (imgSrc === partner.logoUrl && partner.websiteUrl) {
            try {
                const domain = new URL(partner.websiteUrl).hostname;
                setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
            } catch {
                setImgSrc(avatarUrl);
            }
        } else {
            // Otherwise fall back to avatar
            setImgSrc(avatarUrl);
        }
    };

    return (
        <div className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl hover:shadow-orange-500/10">
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div>
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/20 p-2">
                        <img
                            src={imgSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random`}
                            alt={partner.name}
                            className="h-full w-full object-contain"
                            onError={handleError}
                        />
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                        {partner.status && (
                            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${partner.status.toLowerCase().includes("live") ? "border-green-500/20 bg-green-500/10 text-green-500" :
                                    partner.status.toLowerCase().includes("testnet") ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-500" :
                                        "border-white/10 bg-white/5 text-zinc-500"
                                }`}>
                                {partner.status}
                            </span>
                        )}
                        {partner.categories && partner.categories.slice(0, 2).map((cat) => (
                            <span key={cat} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                                {cat}
                            </span>
                        ))}
                        {partner.categories && partner.categories.length > 2 && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-xs font-medium text-zinc-500">
                                +{partner.categories.length - 2}
                            </span>
                        )}
                    </div>
                </div>

                <h3 className="mb-2 text-xl font-bold tracking-tight text-white">
                    {partner.name}
                </h3>

                {partner.description && (
                    <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                        {partner.description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                {partner.xHandle && (
                    <a
                        href={partner.xHandle.startsWith("http") ? partner.xHandle : `https://x.com/${partner.xHandle.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-4 w-4 fill-current"
                        >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span className="sr-only">X (Twitter)</span>
                        Follow
                    </a>
                )}
                {partner.websiteUrl && (
                    <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto flex items-center gap-1.5 text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors"
                    >
                        <Globe className="h-3.5 w-3.5" />
                        Website
                        <ExternalLink className="h-3 w-3" />
                    </a>
                )}
            </div>
        </div>
    );
};
