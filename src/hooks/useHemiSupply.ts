import useSWR from 'swr';
import { ethers, formatUnits } from 'ethers';

const HEMI_RPC_URL = 'https://rpc.hemi.network/rpc';
const HEMI_BTC_CONTRACT = '0xAA40c0c7644e0b2B224509571e10ad20d9C4ef28';

const ABI = [
    "function totalSupply() view returns (uint256)"
];

const fetchSupply = async () => {
    try {
        const provider = new ethers.JsonRpcProvider(HEMI_RPC_URL);
        const contract = new ethers.Contract(HEMI_BTC_CONTRACT, ABI, provider);
        const supply = await contract.totalSupply();
        return formatUnits(supply, 8); // hemiBTC has 8 decimals
    } catch (err) {
        console.error("Error fetching hemiBTC supply:", err);
        throw err;
    }
};

export function useHemiSupply() {
    const { data, error, isLoading } = useSWR('hemiBTC-supply', fetchSupply, {
        refreshInterval: 30000 // Poll every 30s
    });

    return {
        totalSupply: data ? parseFloat(data) : 0,
        isLoading,
        error
    };
}
