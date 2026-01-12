const { ethers } = require("ethers");

const HEMI_RPC_URL = 'https://rpc.hemi.network/rpc';
const HEMI_BTC_CONTRACT = '0xAA40c0c7644e0b2B224509571e10ad20d9C4ef28';

const ABI = [
    "function totalSupply() view returns (uint256)",
    "function decimals() view returns (uint8)"
];

async function main() {
    console.log(`Connecting to ${HEMI_RPC_URL}...`);
    try {
        const provider = new ethers.JsonRpcProvider(HEMI_RPC_URL);
        const network = await provider.getNetwork();
        console.log("Connected to network:", network.name, "Chain ID:", network.chainId);

        const contract = new ethers.Contract(HEMI_BTC_CONTRACT, ABI, provider);
        console.log(`Fetching totalSupply for ${HEMI_BTC_CONTRACT}...`);
        const supply = await contract.totalSupply();
        const decimals = await contract.decimals();
        console.log("Decimals:", decimals);
        console.log("Raw Supply:", supply.toString());
        console.log("Formatted Supply:", ethers.formatUnits(supply, decimals));
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
