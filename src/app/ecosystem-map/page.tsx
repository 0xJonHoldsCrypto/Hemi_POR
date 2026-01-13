import { EcosystemMap } from "@/components/ecosystem/EcosystemMap";

export default function EcosystemMapPage() {
    return (
        <div className="relative h-screen w-screen bg-black text-white overflow-hidden">
            <div className="absolute top-8 left-8 z-10 pointer-events-none">
                <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl mb-2 drop-shadow-md">
                    Ecosystem <span className="text-orange-500">Map</span>
                </h1>
                <p className="text-lg text-zinc-400 max-w-md drop-shadow-sm">
                    Explore the Hemi Network ecosystem in an interactive view.
                </p>
            </div>

            <EcosystemMap />
        </div>
    );
}
