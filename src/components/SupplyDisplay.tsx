"use client";

import { useHemiSupply } from "@/hooks/useHemiSupply";
import { Coins, ExternalLink, Layers, Loader2 } from "lucide-react";

export function SupplyDisplay() {
    const { totalSupply, isLoading, error } = useHemiSupply();

    const formatBTC = (val: number) =>
        new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(val);

    return (
        <div className="glass-card p-6 rounded-xl flex flex-col h-full relative overflow-hidden group border-l-4 border-l-accent">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-9xl font-bold text-accent">h</span>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-accent mb-2">
                    <Layers className="w-5 h-5" />
                    <h2 className="text-lg font-semibold tracking-wider uppercase">hemiBTC Supply</h2>
                </div>

                <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">Total Minted on Hemi Network</p>
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-2xl font-bold animate-pulse">
                            <Loader2 className="w-6 h-6 animate-spin" /> Fetching...
                        </div>
                    ) : error ? (
                        <div className="text-destructive">Error fetching supply</div>
                    ) : (
                        <div className="text-4xl md:text-5xl font-mono font-bold text-foreground">
                            {formatBTC(totalSupply)} <span className="text-xl text-muted-foreground">hemiBTC</span>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">Contract Info</h3>
                    <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Token Contract</span>
                            <a
                                href="https://explorer.hemi.xyz/token/0xAA40c0c7644e0b2B224509571e10ad20d9C4ef28"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80"
                            >
                                View on Explorer <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        <div className="font-mono text-xs break-all text-foreground/80">
                            0xAA40c0c7644e0b2B224509571e10ad20d9C4ef28
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
