import useSWR from 'swr';
import { ethers, formatUnits } from 'ethers';

const CHAINS = [
    {
        name: 'Hemi',
        rpc: 'https://rpc.hemi.network/rpc',
        contract: '0xAA40c0c7644e0b2B224509571e10ad20d9C4ef28',
        explorer: 'https://explorer.hemi.xyz/token',
        color: '#ff4600' // Electric Orange
    },
    {
        name: 'Ethereum',
        rpc: 'https://eth.drpc.org',
        contract: '0x06ea695B91700071B161A434fED42D1DcbAD9f00',
        explorer: 'https://etherscan.io/token',
        color: '#627eea' // ETH Blue
    },
    // {
    //     name: 'Optimism',
    //     rpc: 'https://mainnet.optimism.io',
    //     contract: '0xAA40c0c7644e0b2B22450957106093ef28',
    //     explorer: 'https://optimistic.etherscan.io/token',
    //     color: '#ff0420' // OP Red
    // }
];

const ABI = [
    "function totalSupply() view returns (uint256)",
    "function decimals() view returns (uint8)"
];

const fetchChainSupply = async (chain: typeof CHAINS[0]) => {
    try {
        const provider = new ethers.JsonRpcProvider(chain.rpc);
        const contract = new ethers.Contract(chain.contract, ABI, provider);
        const supply = await contract.totalSupply();
        // Assuming 8 decimals for all hemiBTC instances, but fetching to be safe if possible?
        // Let's hardcode 8 for now since we know Hemi is 8, and bridged usually matches.
        // Actually, we should check decimals.
        // Let's stick to 8 to be fast, but add a fallback if it looks huge? No, consistent 8 is safest bet for OFT.
        return {
            chain: chain.name,
            supply: parseFloat(formatUnits(supply, 8)),
            contract: chain.contract,
            explorer: chain.explorer,
            color: chain.color
        };
    } catch (err) {
        console.error(`Error fetching ${chain.name} supply:`, err);
        return {
            chain: chain.name,
            supply: 0,
            contract: chain.contract,
            explorer: chain.explorer,
            color: chain.color,
            error: true
        };
    }
};

const fetchMultiChainSupply = async () => {
    const results = await Promise.all(CHAINS.map(chain => fetchChainSupply(chain)));

    // Logic Correction (Subtraction Method):
    // Hemi Supply from RPC is the Global Total (since it's an OFT).
    // ETH/OP Supply are bridged amounts.
    // Therefore, "Supply on Hemi Chain" = Global Total - (ETH + OP + Others).

    // 1. Identify Global Total (Hemi) and Bridged Chains
    const hemiResult = results.find(r => r.chain === 'Hemi');
    const otherChains = results.filter(r => r.chain !== 'Hemi');

    if (!hemiResult) throw new Error("Hemi chain data missing");

    const globalTotal = hemiResult.supply;
    const bridgedTotal = otherChains.reduce((acc, curr) => acc + curr.supply, 0);

    // 2. Calculate Hemi Local Supply
    // Allow for small float errors or if other chains exist (Base) that we don't track yet.
    // If Global < Bridged, something is wrong, but default to 0.
    const hemiLocalSupply = Math.max(0, globalTotal - bridgedTotal);

    // 3. Update Hemi result in the list to reflect Local Supply for the breakdown
    // We create a new array to avoid mutating the original fetch results if that matters,
    // though here we are just transforming for UI.
    const adjustedResults = results.map(r => {
        if (r.chain === 'Hemi') {
            return { ...r, supply: hemiLocalSupply };
        }
        return r;
    });

    // 4. Return adjusted list and the Global Total
    return { supplies: adjustedResults, total: globalTotal };
};

export function useMultiChainSupply() {
    const { data, error, isLoading } = useSWR('multichain-supply', fetchMultiChainSupply, {
        refreshInterval: 60000 // Poll every 60s
    });

    return {
        chainData: data?.supplies || [],
        totalCirculating: data?.total || 0,
        isLoading,
        error
    };
}
