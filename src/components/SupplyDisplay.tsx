"use client";

import { useMultiChainSupply } from "@/hooks/useMultiChainSupply";
import { Coins, ExternalLink, Layers, Loader2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function SupplyDisplay() {
    const { chainData, totalCirculating, isLoading, error } = useMultiChainSupply();

    const formatBTC = (val: number) =>
        new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(val);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    return (
        <div className="glass-card p-6 rounded-xl flex flex-col h-full relative overflow-hidden group border-l-4 border-l-accent">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-9xl font-bold text-accent">h</span>
            </div>

            <div className="relative z-10 flex flex-col gap-6">
                {/* Header Section */}
                <div>
                    <div className="flex items-center gap-2 text-accent mb-2">
                        <Layers className="w-5 h-5" />
                        <h2 className="text-lg font-semibold tracking-wider uppercase">hemiBTC Supply</h2>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-1">Total Circulating Supply</p>
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-2xl font-bold animate-pulse">
                                <Loader2 className="w-6 h-6 animate-spin" /> Fetching...
                            </div>
                        ) : error ? (
                            <div className="text-destructive">Error fetching supply</div>
                        ) : (
                            <div className="text-4xl md:text-5xl font-mono font-bold text-foreground">
                                {formatBTC(totalCirculating)} <span className="text-xl text-muted-foreground">hemiBTC</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chain Breakdown Section */}
                {!isLoading && !error && (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Supply by Network</h3>
                        <div className="grid gap-3">
                            {chainData.map((chain) => (
                                <div key={chain.chain} className="p-3 rounded-lg bg-secondary/30 border border-secondary/50 hover:bg-secondary/50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chain.color }} />
                                            <span className="font-medium text-sm">{chain.chain}</span>
                                        </div>
                                        <span className="font-mono font-bold text-sm">
                                            {formatBTC(chain.supply)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5 font-mono opacity-80 bg-black/20 px-1.5 py-0.5 rounded">
                                            {chain.contract.slice(0, 6)}...{chain.contract.slice(-4)}
                                            <button
                                                onClick={() => copyToClipboard(chain.contract)}
                                                className="hover:text-foreground transition-colors"
                                                title="Copy Address"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <a
                                            href={`${chain.explorer}/${chain.contract}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 hover:text-accent transition-colors"
                                        >
                                            Explorer <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
