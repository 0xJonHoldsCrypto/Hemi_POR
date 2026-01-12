"use client";

import { useBitcoinReserve } from "@/hooks/useBitcoinReserve";
import { useHemiSupply } from "@/hooks/useHemiSupply";
import { ReserveDisplay } from "@/components/ReserveDisplay";
import { SupplyDisplay } from "@/components/SupplyDisplay";
import { FAQ } from "@/components/FAQ";
import { CheckCircle2, AlertTriangle, ArrowRight, Loader2, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { totalBTC, isLoading: btcLoading } = useBitcoinReserve();
  const { totalSupply, isLoading: hemiLoading } = useHemiSupply();

  const isLoading = btcLoading || hemiLoading;

  // Logic: 
  // If Total BTC > hemiBTC Supply, the difference is conceptually "Pending Withdrawals" 
  // (tokens burned but BTC not yet released from vault, or in transit).
  // If Total BTC < hemiBTC Supply, it's a deficit (bad).
  const surplus = totalBTC - totalSupply;
  const isFullyBacked = surplus >= 0;
  const pendingWithdrawals = isFullyBacked ? surplus : 0;

  const ratio = totalSupply > 0 ? (totalBTC / totalSupply) * 100 : 0;

  return (
    <main className="min-h-screen p-6 md:p-12 lg:p-24 relative overflow-hidden bg-dot-white/[0.05]">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">

        {/* Header */}
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs uppercase tracking-widest text-primary font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Live PoR Monitor
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
            <span className="text-primary">Hemi</span> Proof of Reserve
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Verifying the 1:1 Bitcoin backing of hemiBTC on the Hemi Network.
          </p>
        </header>

        {/* Status Banner */}
        {!isLoading && (
          <div className={cn(
            "w-full p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border backdrop-blur-md transition-all duration-500 shadow-xl",
            isFullyBacked
              ? "bg-secondary/30 border-primary/20"
              : "bg-destructive/10 border-destructive/20"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-full",
                isFullyBacked ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
              )}>
                {isFullyBacked ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {isFullyBacked ? "Reserves Fully Audited" : "Reserve Deficit Detected"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isFullyBacked
                    ? "All hemiBTC in circulation are 100% backed by Bitcoin held in custody."
                    : "The current supply exceeds the known reserves. Please investigate."}
                </p>
              </div>
            </div>

            {isFullyBacked && pendingWithdrawals > 0.0001 && (
              <div className="flex items-center gap-4 bg-black/40 px-5 py-3 rounded-lg border border-white/5">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">Pending Withdrawals</p>
                  <p className="text-lg font-mono font-bold text-primary">{pendingWithdrawals.toFixed(8)} BTC</p>
                </div>
                <ArrowLeftRight className="w-5 h-5 text-primary/50" />
              </div>
            )}
          </div>
        )}

        {/* Main Flow Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* BTC Left */}
          <div className="lg:col-span-5 h-full">
            <ReserveDisplay />
          </div>

          {/* Middle Flow Visual (Desktop) */}
          <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
            <div className="relative z-10 bg-black border border-white/10 p-3 rounded-full">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
            {pendingWithdrawals > 0 && (
              <div className="absolute top-1/2 -translate-y-12 bg-card/80 backdrop-blur px-3 py-1 rounded border border-primary/30 text-xs font-mono text-primary">
                {pendingWithdrawals.toFixed(4)} Pending
              </div>
            )}
          </div>

          {/* Middle Flow Visual (Mobile) */}
          <div className="lg:col-span-2 lg:hidden flex items-center justify-center py-4">
            <div className="bg-black border border-white/10 p-3 rounded-full rotate-90">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* hemiBTC Right */}
          <div className="lg:col-span-5 h-full">
            <SupplyDisplay />
          </div>
        </div>

        {/* Comparison Details */}
        <div className="glass-panel p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-l-primary/50">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-semibold">Collateralization Ratio</h3>
            <p className="text-muted-foreground">Current backing percentage based on verified on-chain data.</p>
          </div>
          <div className="flex items-center gap-8 w-full md:w-auto justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold font-mono text-primary">{ratio.toFixed(3)}%</span>
            </div>
            <div className="h-3 flex-1 w-full md:w-64 bg-secondary/50 rounded-full overflow-hidden relative">
              <div
                className={cn("h-full absolute top-0 left-0 transition-all duration-1000", isFullyBacked ? "bg-primary" : "bg-destructive")}
                style={{ width: `${Math.min(ratio, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* FAQ */}
        <FAQ />

        {/* Footer */}
        <footer className="pt-12 pb-6 text-center text-sm text-muted-foreground border-t border-white/5 mt-12">
          <p>© {new Date().getFullYear()} Hemi Labs. Powered by Bitcoin & Hemi.</p>
        </footer>

      </div>
    </main>
  );
}
