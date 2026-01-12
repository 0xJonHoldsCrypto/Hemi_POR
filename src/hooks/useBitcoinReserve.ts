import useSWR from 'swr';

const BTC_WALLETS = [
    '1GawhMSUVu3bgRiNmejbVTBjpwBygGWSqf',
    '16NuSCxDVCAXbKs9GRbjbHXbwGXu3tnPSo',
    'bc1q4lpa9d5zxehge7vx86784gcxy23hc3xwp3gl422venswe6pvhh5qpn9xfj'
];

interface AddressStats {
    address: string;
    chain_stats: {
        funded_txo_count: number;
        funded_txo_sum: number;
        spent_txo_count: number;
        spent_txo_sum: number;
        tx_count: number;
    };
    mempool_stats: {
        funded_txo_count: number;
        funded_txo_sum: number;
        spent_txo_count: number;
        spent_txo_sum: number;
        tx_count: number;
    };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useBitcoinReserve() {
    const { data, error, isLoading } = useSWR<AddressStats[]>(
        BTC_WALLETS.map(addr => `https://mempool.space/api/address/${addr}`),
        (urls: string[]) => Promise.all(urls.map(url => fetch(url).then(r => r.json())))
    );

    const totalSats = data?.reduce((acc, curr) => {
        const confirmed = (curr.chain_stats.funded_txo_sum || 0) - (curr.chain_stats.spent_txo_sum || 0);
        // We can also decide to include mempool (unconfirmed) if desired, but PoR usually counts confirmed.
        // Let's stick to confirmed for safety.
        return acc + confirmed;
    }, 0) || 0;

    const totalBTC = totalSats / 100_000_000;

    return {
        totalBTC,
        walletStats: data,
        isLoading,
        error
    };
}
