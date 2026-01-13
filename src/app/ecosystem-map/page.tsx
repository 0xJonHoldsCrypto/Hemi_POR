import { EcosystemMap } from "@/components/ecosystem/EcosystemMap";

export default function EcosystemMapPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-4 text-center text-3xl font-bold tracking-tight text-white md:text-5xl">
                    Ecosystem <span className="text-orange-500">Map</span>
                </h1>
                <p className="mb-8 text-center text-zinc-400">
                    Explore the Hemi Network ecosystem in an interactive view.
                </p>

                <EcosystemMap />
            </div>
        </div>
    );
}
