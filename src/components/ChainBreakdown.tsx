"use client";

import { useMultiChainSupply } from "@/hooks/useMultiChainSupply";
import { ExternalLink, Loader2, Network } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChainBreakdown() {
    const { chainData, totalCirculating, isLoading } = useMultiChainSupply();

    const formatBTC = (val: number) =>
        new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(val);

    return (
        <div className="glass-panel p-6 rounded-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <Network className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold tracking-wide">Multi-chain Breakdown</h3>
            </div>

            {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground animate-pulse p-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Fetching chain data...
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {chainData.map((chain) => (
                            <div key={chain.name} className="relative overflow-hidden rounded-lg border border-white/5 bg-secondary/20 p-4 transition-all hover:bg-secondary/30">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chain.color }} />
                                        {chain.name}
                                    </span>
                                    <a
                                        href={`${chain.explorer}/${chain.contract}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-muted-foreground hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <div className="text-2xl font-mono font-bold">
                                    {formatBTC(chain.supply)} <span className="text-xs text-muted-foreground font-sans font-normal">hemiBTC</span>
                                </div>
                                {/* Visual bar for proportion */}
                                <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 w-full">
                                    <div
                                        className="h-full"
                                        style={{
                                            backgroundColor: chain.color,
                                            width: `${(chain.supply / totalCirculating) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-right text-xs text-muted-foreground pt-2 border-t border-white/5">
                        Total Circulating across all chains: <span className="font-mono text-primary">{formatBTC(totalCirculating)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
