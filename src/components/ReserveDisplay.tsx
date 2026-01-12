"use client";

import { useBitcoinReserve } from "@/hooks/useBitcoinReserve";
import { Wallet, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReserveDisplay() {
    const { totalBTC, walletStats, isLoading, error } = useBitcoinReserve();

    const formatBTC = (val: number) =>
        new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(val);

    return (
        <div className="glass-card p-6 rounded-xl flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-9xl font-bold text-primary">₿</span>
            </div>

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <ShieldCheck className="w-5 h-5" />
                    <h2 className="text-lg font-semibold tracking-wider uppercase">Bitcoin Reserves</h2>
                </div>

                <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">Total Held on Bitcoin Network</p>
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-2xl font-bold animate-pulse">
                            <Loader2 className="w-6 h-6 animate-spin" /> Fetching...
                        </div>
                    ) : error ? (
                        <div className="text-red-500">Error fetching data</div>
                    ) : (
                        <div className="text-4xl md:text-5xl font-mono font-bold text-foreground">
                            {formatBTC(totalBTC)} <span className="text-xl text-muted-foreground">BTC</span>
                        </div>
                    )}
                </div>

                <div className="mt-8 space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Reserve Wallets</h3>
                    {walletStats?.map((stat, idx) => (
                        <div key={stat.address} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-secondary/50 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="bg-primary/10 p-2 rounded-full text-primary">
                                    <Wallet className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <a
                                        href={`https://mempool.space/address/${stat.address}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs md:text-sm font-mono text-muted-foreground hover:text-primary transition-colors truncate flex items-center gap-1"
                                    >
                                        {stat.address.slice(0, 8)}...{stat.address.slice(-8)}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                            <div className="font-mono text-sm font-medium">
                                {formatBTC(((stat.chain_stats.funded_txo_sum - stat.chain_stats.spent_txo_sum) / 100_000_000))} BTC
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
