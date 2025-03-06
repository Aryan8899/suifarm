import React, { useState, useEffect } from 'react';
import { useWallet } from "@suiet/wallet-kit";

// Interface for LP Coin Entry
interface LpCoinEntry {
  lpCoinId: string;
  pairId: string;
  packageId: string;
}

// Interface for Pair Information
interface PairInfo {
  lpCoinId: string;
  pairId: string;
  packageId: string;
  token0: string;
  token1: string;
  details?: Record<string, any>;
}

// Helper function to create a valid PairInfo object
const createPairInfo = (
  lpCoinId: string, 
  pairId: string, 
  packageId: string,
  token0: string, 
  token1: string, 
  details?: any
): PairInfo => ({
  lpCoinId,
  pairId,
  packageId,
  token0: token0 || 'Unknown',
  token1: token1 || 'Unknown',
  ...(details ? { details } : {})
});

// Hook to discover pairs
export const usePairDiscovery = () => {
  const { account } = useWallet();
  const [lpCoins, setLpCoins] = useState<LpCoinEntry[]>([]);
  const [pairs, setPairs] = useState<PairInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account?.address) return;
  
    const discoverPairs = async () => {
      setLoading(true);
      setError(null);
  
      try {
        console.log(`🔹 Fetching LP Coins for account: ${account.address}`);
        
        // Fetch LP Coins for the account
        const lpCoinResponse = await fetch(
          `http://localhost:5000/api/lpcoin/${account.address}`
        );

        if (!lpCoinResponse.ok) throw new Error('Failed to fetch LP Coins');

        const lpCoinData: LpCoinEntry[] = await lpCoinResponse.json();
        console.log('✅ LP Coin Data:', lpCoinData);
        setLpCoins(lpCoinData);

        if (lpCoinData.length === 0) {
          setPairs([]);
          setLoading(false);
          return;
        }

        // Collect unique package IDs
        const uniquePackageIds = [...new Set(
          lpCoinData.map(coin => coin.packageId).filter(Boolean)
        )];

        console.log('🔹 Filtered Unique Package IDs:', uniquePackageIds);

        // Fetch pairs for each package ID
        const pairPromises = uniquePackageIds.map(async (packageId) => {
          try {
            const pairsResponse = await fetch(
              `http://localhost:5000/api/pairs/${packageId}`
            );

            if (!pairsResponse.ok) {
              console.warn(`⚠️ Failed to fetch pairs for Package ID ${packageId}`);
              return [];
            }

            const pairsData = await pairsResponse.json();
            console.log(`✅ Pairs Data for ${packageId}:`, pairsData);

            return pairsData.map((pairData: any) => {
              const { token0, token1 } = extractTokenName(pairData);
              return createPairInfo(
                pairData.lpCoinId || '', 
                pairData.pairId || '', 
                packageId,
                token0, 
                token1, 
                pairData
              );
            });
          } catch (pairError) {
            console.error(`❌ Error fetching pairs for Package ID ${packageId}:`, pairError);
            return [];
          }
        });

        // Wait for all pairs to be fetched
        const resolvedPairs = (await Promise.all(pairPromises)).flat();
        console.log('✅ Resolved Pairs:', resolvedPairs);
        setPairs(resolvedPairs);
      } catch (err) {
        console.error('❌ Pair Discovery Error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    discoverPairs();
  }, [account?.address]);

  return { lpCoins, pairs, loading, error };
};

// Function to extract token names
const extractTokenName = (pairData: any) => {
  if (!pairData) {
    console.warn('⚠️ Pair data is undefined');
    return { token0: 'Unknown', token1: 'Unknown' };
  }

  if (pairData.token0Type?.name && pairData.token1Type?.name) {
    return {
      token0: pairData.token0Type.name.split('::').pop() || 'Unknown',
      token1: pairData.token1Type.name.split('::').pop() || 'Unknown'
    };
  }

  console.log('⚠️ Unable to extract tokens from pair data:', pairData);
  return { token0: 'Unknown', token1: 'Unknown' };
};

// Component to display discovered pairs
export const PairDiscoveryDisplay: React.FC = () => {
  const { lpCoins, pairs, loading, error } = usePairDiscovery();
  const { account } = useWallet();

  if (!account?.address) {
    return (
      <div className="bg-[#1f2028] p-4 rounded-lg text-white text-center">
        Please connect your wallet to view pair discovery
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#1f2028] p-4 rounded-lg text-white text-center">
        Loading pair discovery...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1f2028] p-4 rounded-lg text-red-500 text-center">
        {error}
      </div>
    );
  }

  const truncateId = (id: string) => id.length > 10 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id;

  return (
    <div className="bg-[#1f2028] p-4 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">Discovered Pairs</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-[#b794f4]">
              <th className="p-3">Package ID</th>
              <th className="p-3">LP Coin ID</th>
              <th className="p-3">Pair ID</th>
              <th className="p-3">Token 0</th>
              <th className="p-3">Token 1</th>
            </tr>
          </thead>
          <tbody>
            {pairs.length > 0 ? (
              pairs.map((pair, index) => (
                <tr 
                  key={index} 
                  className="border-t border-[#4a5568] hover:bg-[#2c2d3a]/50 transition"
                >
                  <td className="p-3">{truncateId(pair.packageId)}</td>
                  <td className="p-3">{truncateId(pair.lpCoinId)}</td>
                  <td className="p-3">{truncateId(pair.pairId)}</td>
                  <td className="p-3">{pair.token0 || 'Unknown'}</td>
                  <td className="p-3">{pair.token1 || 'Unknown'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-3 text-center text-gray-400">
                  No pairs discovered
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PairDiscoveryDisplay;
