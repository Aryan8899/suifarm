import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pool } from "../types";
import { useWallet } from "@suiet/wallet-kit"; // Using Suiet Wallet
import { Transaction } from "@mysten/sui/transactions";
//import { toast } from "react-hot-toast";
import { toast } from 'sonner';
import { CONSTANTS } from "../constants/addresses";
import { TokenSelect } from "./TokenSelect"; // Import the separate TokenSelect component
import { useSuiClient } from '@mysten/dapp-kit';
import UserStakesComponent from "./UserStakesComponent ";

interface StakedEventParsedJson {
  amount?: string;
  [key: string]: any;
}

export const Farm = () => {
  const [activeTab, setActiveTab] = useState("all-pools");
  const [stakingTab, setStakingTab] = useState(""); // "" means no staking tab selected
  
  // Single token staking state
  const [singleToken, setSingleToken] = useState("");
  const [singleTokenBalance, setSingleTokenBalance] = useState("0");
  const [singleTokenInfo, setSingleTokenInfo] = useState<{ type: string; name: string; symbol: string } | null>(null);
  
  // LP token staking state
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");
  const [lpBalances, setLpBalances] = useState([]);
  const [totalLpBalance, setTotalLpBalance] = useState("0");
  const [tokenOrder, setTokenOrder] = useState<{ token0Type: string; token1Type: string } | null>(null);

  const [lpPairId, setLpPairId] = useState<string | null>(null);
  const {
    fetchUserStakes,
    isLoading: stakesLoading,
    singleAssetStakes,
    lpStakes,
    renderSingleStakes,
    renderLPStakes,
    refreshStakes
  } = UserStakesComponent();
  
  // Common staking state
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakePercentage, setStakePercentage] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("all-networks");
  const [isStakingSingleLoading, setIsStakingSingleLoading] = useState(false);
  const [isStakingLPLoading, setIsStakingLPLoading] = useState(false);
  const { connected, account, signAndExecuteTransactionBlock } = useWallet();
  const navigate = useNavigate();
  const suiClient = useSuiClient();

  const pools: Pool[] = [
    {
      id: 1,
      token0: "SUI",
      token1: "WBNB",
      network: "BNB SMART CHAIN",
      version: "V3",
      feeTier: "0.01%",
      apr: { current: 66.68, previous: 57.56 },
      tvl: 6935917.0,
      volume24h: 92665164,
      poolType: "v3",
    },
    {
      id: 2,
      token0: "STK1",
      token1: "WBNB",
      network: "BNB SMART CHAIN",
      version: "V3",
      feeTier: "0.01%",
      apr: { current: 66.68, previous: 57.56 },
      tvl: 6935917.0,
      volume24h: 92665164,
      poolType: "v3",
    },
    {
      id: 3,
      token0: "STK2",
      token1: "WBNB",
      network: "BNB SMART CHAIN",
      version: "V3",
      feeTier: "0.01%",
      apr: { current: 66.68, previous: 57.56 },
      tvl: 6935917.0,
      volume24h: 92665164,
      poolType: "v3",
    },
  ];

  useEffect(() => {
    if (account?.address && (stakingTab === "single" || stakingTab === "lp")) {
      refreshStakes();
    }
  }, [stakingTab, account?.address]);

  // Helper functions
  const getBaseType = (coinType: string) => {
    try {
      if (coinType.includes('::coin::Coin<')) {
        const match = coinType.match(/<(.+)>/);
        return match ? match[1] : coinType;
      }
      return coinType;
    } catch (error) {
      console.error('Error parsing coin type:', error);
      return coinType;
    }
  };
// Helper function to normalize token types
const normalizeType = (type:string) => {
  type = type.trim();
  type = type.endsWith('>') ? type.slice(0, -1) : type;
  return type;
};

// Helper function to compare token types
const compareTokenTypes = (type1:string, type2:string) => {
  return normalizeType(type1) === normalizeType(type2);
};

// Helper function to sort tokens
const sortTokens = async (type0:string, type1:string) => {
  // Sort tokens according to factory's sorting rules
  if (type0 === "0x2::sui::SUI") return { token0Type: type0, token1Type: type1 };
  if (type1 === "0x2::sui::SUI") return { token0Type: type1, token1Type: type0 };

  // For all other cases, sort by address
  const addr0 = type0.split('::')[0];
  const addr1 = type1.split('::')[0];
  return addr0.toLowerCase() < addr1.toLowerCase() 
    ? { token0Type: type0, token1Type: type1 }
    : { token0Type: type1, token1Type: type0 };
};

  const formatBalance = (balance: string | number, decimals = 9) => {
    if (!balance) return "0.000000";
    return (Number(balance) / Math.pow(10, decimals)).toFixed(6);
  };

  // IMPORTANT: Handler for single token selection that works with real token IDs
  const handleSingleTokenSelect = async (tokenId:string) => {
    console.log("Single token selected:", tokenId);
    setSingleToken(tokenId);
    
    if (!tokenId || !account?.address) {
      setSingleTokenBalance("0");
      setSingleTokenInfo(null);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get token type
      const tokenObj = await suiClient.getObject({ 
        id: tokenId, 
        options: { showType: true, showContent: true }
      });
      
      if (!tokenObj.data) throw new Error('Token not found');
      
      const tokenType = getBaseType(tokenObj.data.type || '');
      const tokenName = (tokenObj.data.content as { fields?: { name: string } })?.fields?.name || 'Unknown Token';
    
      // Improved symbol retrieval
      let tokenSymbol = (tokenObj.data.content as { fields?: { symbol: string } })?.fields?.symbol;

      if (!tokenSymbol) {
        // Try to extract symbol from the token type
        const typeParts = tokenType.split('::');
        tokenSymbol = typeParts[typeParts.length - 1].toUpperCase();
      }
      
      // Fallback to a generic symbol if all else fails
      tokenSymbol = tokenSymbol || 'TOKEN';
  
  
      // Get tokens of this type owned by user
      const coins = await suiClient.getCoins({
        owner: account.address,
        coinType: tokenType
      });
      
      // Calculate total balance
      const totalBalance = coins.data.reduce((sum, coin) => 
        sum + BigInt(coin.balance || 0), 0n);
      
      setSingleTokenBalance(totalBalance.toString());
      setSingleTokenInfo({
        type: tokenType,
        name: tokenName,
        symbol: tokenSymbol
      });
      
    } catch (error) {
      console.error('Error loading token data:', error);
      toast.error('Error loading token data');
      setSingleTokenBalance("0");
      setSingleTokenInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for token0 selection
  const handleToken0Select = (tokenId:string) => {
    console.log("Token0 selected:", tokenId);
    setToken0(tokenId);
    checkAndUpdateLPInfo(tokenId, token1);
  };

  // Handler for token1 selection
  const handleToken1Select = (tokenId:string) => {
    console.log("Token1 selected:", tokenId);
    setToken1(tokenId);
    checkAndUpdateLPInfo(token0, tokenId);
  };

  // Update LP info when both tokens are selected
  const checkAndUpdateLPInfo = async (t0: string | null, t1: string | null) => {
    if (!t0 || !t1 || !account?.address) return;
    
    setIsLoading(true);
    
    try {
      // Get token types
      const [token0Obj, token1Obj] = await Promise.all([
        suiClient.getObject({ id: t0, options: { showType: true } }),
        suiClient.getObject({ id: t1, options: { showType: true } })
      ]);
  
      const token0Type = getBaseType(token0Obj.data?.type || '');
      const token1Type = getBaseType(token1Obj.data?.type || '');
  
      // Sort tokens to match factory's order
      const sortedTokens = await sortTokens(token0Type, token1Type);
      setTokenOrder(sortedTokens);
      
      console.log('Sorted token types:', sortedTokens);
      
      // Find the pair from PairCreated events
      const events = await suiClient.queryEvents({
        query: { 
          MoveEventType: `${CONSTANTS.PACKAGE_ID}::${CONSTANTS.MODULES.FACTORY}::PairCreated` 
        }
      });
  
      const normalizeSuiAddress = (addr:string) => {
        if (addr === "0x2") return "0000000000000000000000000000000000000000000000000000000000000002";
        return addr.replace('0x', '');
      };
  
      const normalizeType = (type:string) => {
        const parts = type.split('::');
        return `${normalizeSuiAddress(parts[0])}::${parts[1]}::${parts[2]}`;
      };
  
      const pair = events.data.find(event => {
        const fields = event.parsedJson as any;;
        return (
          fields.token0.name === normalizeType(sortedTokens.token0Type) && 
          fields.token1.name === normalizeType(sortedTokens.token1Type)
        );
      });
  
      if (!pair) {
        console.log('Pair not found for tokens:', { token0Type, token1Type });
        setLpBalances([]);
        setTotalLpBalance('0');
        setLpPairId(null);
        setIsLoading(false);
        return;
      }
  
      const pairId = (pair.parsedJson as { pair: string }).pair;

      console.log('Found pair:', pairId);
      setLpPairId(pairId);
      
      // Get LP tokens matching this pair
      const objects = await suiClient.getOwnedObjects({
        owner: account.address,
        options: { showType: true, showContent: true }
      });
  
      // Filter for LP tokens
      const lpTokens = objects.data
        .filter(obj => {
          // Check if it's from our package
          if (!obj.data?.type?.includes(CONSTANTS.PACKAGE_ID)) {
            return false;
          }
  
          // Check if it's an LP token of the correct type
          if (!obj.data.type.includes(`::${CONSTANTS.MODULES.PAIR}::LPCoin<`)) {
            return false;
          }
  
          // Extract and compare the token types
          const typeString = obj.data.type;
          const lpTokenTypes = typeString.match(/LPCoin<(.+),\s*(.+)>/);
          if (!lpTokenTypes) return false;
  
          // Clean up and normalize the token types from the LP token
          const [, lpType0, lpType1] = lpTokenTypes;
          const normalizedLpType0 = getBaseType(lpType0.trim());
          const normalizedLpType1 = getBaseType(lpType1.trim().replace('>', ''));
  
          // Check if they match our sorted token pair
          return (
            compareTokenTypes(normalizedLpType0, sortedTokens.token0Type) && 
            compareTokenTypes(normalizedLpType1, sortedTokens.token1Type)
          );
        })
        .map(obj => ({
          id: obj.data?.objectId,
          type: obj.data?.type,
          metadata: { 
            name: `LP-${sortedTokens.token0Type.split('::').pop()}/${sortedTokens.token1Type.split('::').pop()}`,
            symbol: 'LP' 
          },
          balance: (obj.data?.content as any)?.fields?.balance || '0'
        }));
  
      console.log('Found LP tokens:', lpTokens);
  
      // Calculate total balance
      const totalBalance = lpTokens.reduce((sum, token) => 
        sum + BigInt(token.balance || 0), 0n);
  
      setLpBalances(lpTokens as any);
      setTotalLpBalance(totalBalance.toString());
  
    } catch (error) {
      console.error('Error finding pair and LP tokens:', error);
      toast.error('Error loading LP tokens');
      setLpBalances([]);
      setTotalLpBalance('0');
      setLpPairId(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this useEffect to reset token states when switching tabs
useEffect(() => {
  // Reset single token states when switching away from single token staking
  if (stakingTab !== "single") {
    setSingleToken("");
    setSingleTokenBalance("0");
    setSingleTokenInfo(null);
  }

  // Reset LP token states when switching away from LP token staking
  if (stakingTab !== "lp") {
    setToken0("");
    setToken1("");
    setLpBalances([]);
    setTotalLpBalance("0");
    setTokenOrder(null);
    setLpPairId(null);
  }
}, [stakingTab]);

  // Calculate stake amount based on percentage
  useEffect(() => {
    if (stakingTab === 'single') {
      const amount = (BigInt(singleTokenBalance || "0") * BigInt(stakePercentage)) / BigInt(100);
      setStakeAmount(amount.toString());
    } else if (stakingTab === 'lp') {
      const amount = (BigInt(totalLpBalance || "0") * BigInt(stakePercentage)) / BigInt(100);
      setStakeAmount(amount.toString());
    }
  }, [stakePercentage, singleTokenBalance, totalLpBalance, stakingTab]);

  

  // Function to handle single token staking
  const handleStakeSingle = async () => {
    if (!connected || !account?.address || !singleTokenInfo || BigInt(stakeAmount) <= 0) {
      toast.error("Please select a valid token and amount");
      return;
    }

      // Create a local loading state just for this button
      setIsStakingSingleLoading(true);
  
   
    const toastId = toast.loading("Processing transaction...");
  
    try {
      //setIsLoading(true);
     
      // Get coins to use for staking (this would use suiClient in real implementation)
      const coins = await suiClient.getCoins({
        owner: account.address,
        coinType: singleTokenInfo.type
      });

      if (coins.data.length === 0) {
        throw new Error('No coins found for this token');
      }

      // Sort coins by balance (largest first)
      const sortedCoins = [...coins.data].sort((a, b) => {
        const balanceA = BigInt(a.balance);
        const balanceB = BigInt(b.balance);
        return Number(balanceB - balanceA);
      });

      const targetAmount = BigInt(stakeAmount);
      const tx = new Transaction();

      // Get the largest coin and its balance
      const biggestCoin = sortedCoins[0];
      const biggestCoinBalance = BigInt(biggestCoin.balance);
      
      let coinToUse;

      if (biggestCoinBalance >= targetAmount) {
        // If largest coin is enough, just split it if needed
        const primaryCoinObject = tx.object(biggestCoin.coinObjectId);
        coinToUse = biggestCoinBalance > targetAmount 
          ? tx.splitCoins(primaryCoinObject, [tx.pure.u64(targetAmount.toString())])
          : primaryCoinObject;
      } else {
        // If largest coin isn't enough, we need to merge coins
        let remainingTarget = targetAmount;
        const coinsNeeded = [];
        
        // Collect coins until we reach target
        for (const coin of sortedCoins) {
          if (remainingTarget <= 0n) break;
          const coinBalance = BigInt(coin.balance);
          coinsNeeded.push(coin.coinObjectId);
          remainingTarget -= coinBalance;
        }

        if (remainingTarget > 0n) {
          throw new Error('Not enough tokens to reach target amount');
        }

        // Create primary coin and merge others into it
        const primaryCoin = tx.object(coinsNeeded[0]);
        if (coinsNeeded.length > 1) {
          const otherCoins = coinsNeeded.slice(1).map(id => tx.object(id));
          tx.mergeCoins(primaryCoin, otherCoins);
        }
        coinToUse = primaryCoin;
      }
      
      // Build the stake transaction
      tx.moveCall({
        target: `${CONSTANTS.PACKAGE_ID}::${CONSTANTS.MODULES.FARM}::stake_single`,
        typeArguments: [singleTokenInfo.type],
        arguments: [
          tx.object(CONSTANTS.FARM_ID),
          coinToUse, // Pass the actual coin object, not just the amount
          tx.object(CONSTANTS.VICTORY_TOKEN.TREASURY_CAP_WRAPPER_ID),
        ],
      });

      console.log('Executing transaction for single token staking...');
      const txResult = await signAndExecuteTransactionBlock({
        transactionBlock: tx as any
      });
  
      console.log('Transaction Result:', JSON.stringify(txResult, null, 2));
  

      if (txResult?.digest) {
        const transactionStatus = await suiClient.getTransactionBlock({
          digest: txResult.digest,
          options: {
            showEffects: true,
            showEvents: true,
          }
        });
  
        console.log('Full Transaction Status:', JSON.stringify(transactionStatus, null, 2));
  
        // Find the Staked event
        const stakedEvent = transactionStatus.events?.find(
          (event: { type: string }) => event.type.includes('::Staked')
        );

        const parsedJson = stakedEvent?.parsedJson as StakedEventParsedJson;
  
        console.log('Staked Event Details:', stakedEvent);
  
        // Extract staked amount from the event
        // Now you can safely access the amount property
          let stakedAmount = BigInt(stakeAmount);
          
          if (stakedEvent?.parsedJson) {
            const parsedJson = stakedEvent.parsedJson as StakedEventParsedJson;
            if (parsedJson.amount) {
              stakedAmount = BigInt(parsedJson.amount);
              console.log('Staked Amount from Event:', stakedAmount.toString());
            }
          }
          
          // Refresh user stakes
          refreshStakes();
          
          // Dismiss loading toast and show success
          toast.dismiss(toastId);
          toast.success(`Successfully staked ${formatBalance(stakedAmount.toString())} ${singleTokenInfo.symbol}`);

      } else {
        toast.dismiss(toastId);
        toast.error('Transaction failed');
      }
    
    } catch (error) {
      toast.dismiss(toastId);
  
      const err = error as Error;
      console.error('Staking error:', error);
      toast.error(`Failed to stake: ${err.message}`);
    } finally {
      setIsStakingSingleLoading(false);
    }
  };

  useEffect(() => {
    if (account?.address) {
      refreshStakes();
    }
  }, [account?.address]);

  // Function to handle LP token staking
  const handleStakeLP = async () => {
    if (!connected || !account?.address || lpBalances.length === 0 || !tokenOrder || BigInt(stakeAmount) <= 0) {
      toast.error("Please select a valid pair with LP tokens");
      return;
    }

    //const [isStakingLoading, setIsStakingLoading] = useState(false);
  
    setIsStakingLPLoading(true);
    const toastId = toast.loading("Processing transaction...");
  
    try {
      

      const targetAmount = BigInt(stakeAmount);
      const tx = new Transaction();
      
      // For demo, we'll create mock LP coins
      let lpCoinsForVector: any[] = [];
      if (lpBalances.length > 0) {
        // Simulate splitting one coin
        const largestLpObject = tx.object((lpBalances as any)[0].id);
        const splitCoin = tx.splitCoins(largestLpObject, [tx.pure.u64(targetAmount.toString())]);
        lpCoinsForVector = [splitCoin];
      }
      
      // Create the vector for LP coins
      const vectorArg = tx.makeMoveVec({
        elements: lpCoinsForVector
      });
      
      // Build stake_lp transaction with proper arguments
      tx.moveCall({
        target: `${CONSTANTS.PACKAGE_ID}::${CONSTANTS.MODULES.FARM}::stake_lp`,
        typeArguments: [tokenOrder.token0Type, tokenOrder.token1Type],
        arguments: [
          tx.object(CONSTANTS.FARM_ID),
          vectorArg,
          tx.pure.u256(targetAmount.toString()),
          tx.object(CONSTANTS.VICTORY_TOKEN.TREASURY_CAP_WRAPPER_ID)
        ]
      });
    
      console.log('Executing transaction for LP token staking...');
      const txResult = await signAndExecuteTransactionBlock({
        transactionBlock: tx as any
      });
  
      if (txResult?.digest) {
        const transactionStatus = await suiClient.getTransactionBlock({
          digest: txResult.digest,
          options: {
            showEffects: true,
            showEvents: true,
          }
        });

        console.log('Full Transaction Status:', JSON.stringify(transactionStatus, null, 2));
  
        // Find the Staked event
        const stakedEvent = transactionStatus.events?.find(
          (event: { type: string }) => event.type.includes('::Staked')
        );

        console.log('Staked Event Found:', stakedEvent ? 'Yes' : 'No');
  
        // Extract staked amount from the event
        const parsedJson = stakedEvent?.parsedJson as StakedEventParsedJson;

        // Now you can safely access the amount property
        let stakedAmount = BigInt(stakeAmount);
          
        if (stakedEvent?.parsedJson) {
          const parsedJson = stakedEvent.parsedJson as StakedEventParsedJson;
          if (parsedJson.amount) {
            stakedAmount = BigInt(parsedJson.amount);
            console.log('Staked Amount from Event:', stakedAmount.toString());
          }
        }
        
        // Refresh user stakes
        refreshStakes();
        
        toast.dismiss(toastId);
        toast.success(`Successfully staked ${formatBalance(stakedAmount.toString())} LP tokens`);
      } else {
        toast.dismiss(toastId);
        toast.error('Transaction failed');
      }
    
    
    
    } catch (error) {
      toast.dismiss(toastId);
      const err = error as Error;
      toast.error(`Failed to stake LP tokens: ${err.message}`, { id: toastId });
    } finally {
     
      setIsStakingLPLoading(false);
    }
  };

  // Generic handler that calls the appropriate staking function
  const handleStake = () => {
    if (stakingTab === 'single') {
      handleStakeSingle();
    } else if (stakingTab === 'lp') {
      handleStakeLP();
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white space-y-4 relative">
      <div className="rotating-background"></div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
          {["all-pools", "my-positions", "history"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg font-dela uppercase ${
                activeTab === tab && stakingTab === "" ? "bg-green-500" : "bg-blue-900"
              } hover:bg-green-600 transition-colors`}
              onClick={() => {
                setActiveTab(tab);
                setStakingTab(""); // Hide staking sections when switching to pool tabs
              }}
            >
              {tab
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ))}

          <button
            onClick={() => {
              setStakingTab("single");
              setActiveTab(""); // Hide pools section when staking tab is active
            }}
            className={`px-4 py-2 rounded-lg font-dela uppercase ${
              stakingTab === "single" ? "bg-green-500" : "bg-blue-900"
            } hover:bg-green-600 transition-colors`}
          >
            Single Token
          </button>
          <button
            onClick={() => {
              setStakingTab("lp");
              setActiveTab(""); // Hide pools section when staking tab is active
            }}
            className={`px-4 py-2 rounded-lg font-dela uppercase ${
              stakingTab === "lp" ? "bg-green-500" : "bg-blue-900"
            } hover:bg-green-600 transition-colors`}
          >
            LP Token
          </button>
        </div>

        {/* Only show filters and pools table when activeTab is set and stakingTab is not */}
        {activeTab && !stakingTab && (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <select
                  className="w-full bg-blue-900 px-4 py-2 rounded-lg font-poppins border-2 border-yellow-400"
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                >
                  <option value="all-networks">All networks</option>
                  <option value="bnb">SUI</option>
                </select>
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="All tokens"
                  className="w-full bg-blue-900 px-4 py-2 rounded-lg font-poppins border-2 border-yellow-400"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {["All", "V3", "V2", "StableSwap"].map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-lg font-dela ${
                      filter === "All" ? "bg-green-500" : "bg-blue-900"
                    } hover:bg-green-600 transition-colors`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="border-2 border-yellow-400 rounded-lg overflow-scroll">
              <table className="w-full">
                <thead className="bg-blue-900">
                  <tr className="border-b-2 border-yellow-400">
                    <th className="px-4 py-3 text-left text-blue-300 text-sm font-dela uppercase">
                      ALL POOLS
                    </th>
                    <th className="px-4 py-3 text-center text-blue-300 text-sm font-dela uppercase">
                      APR
                    </th>
                    <th className="px-4 py-3 text-center text-blue-300 text-sm font-dela uppercase">
                      TVL
                    </th>
                    <th className="px-4 py-3 text-center text-blue-300 text-sm font-dela uppercase">
                      VOLUME 24H
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pools.map((pool) => (
                    <tr
                      key={pool.id}
                      className="bg-blue-950 border-b-2 border-yellow-400 last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1">
                            <img
                              src={`https://blog.sui.io/content/images/2023/04/Sui_Droplet_Logo_Blue-3.png`}
                              alt={pool.token0}
                              className="w-8 h-8 rounded-full border-2 border-yellow-400"
                            />
                            <img
                              src={`https://cdn3d.iconscout.com/3d/premium/thumb/sui-coin-3d-icon-download-in-png-blend-fbx-gltf-file-formats--crypto-cryptocurrency-pack-science-technology-icons-7479564.png`}
                              alt={pool.token1}
                              className="w-8 h-8 rounded-full border-2 border-yellow-400"
                            />
                          </div>
                          <div>
                            <div
                              className="font-dela text-lg cursor-pointer hover:text-blue-300 transition-colors"
                              onClick={() => navigate("/pair")}
                            >
                              {pool.token0} / {pool.token1}
                            </div>
                            <div className="text-sm text-gray-400 font-poppins">
                              {pool.network}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-green-400 font-poppins">
                        Up to {pool.apr.current}%
                        <span className="text-gray-400 line-through ml-2">
                          {pool.apr.previous}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-poppins">
                        ${pool.tvl.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center font-poppins">
                        ${pool.volume24h.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            
          </>
        )}

        {/* Single Token Staking Section with enhanced UI */}
        {stakingTab === "single" && (
          <div className="border-2 border-yellow-400 rounded-lg p-4">
            <h2 className="text-xl font-dela mb-4">Single Token Staking</h2>
            
            {/* Token Select Component */}
            <TokenSelect label="Select Token" onSelect={handleSingleTokenSelect} />
            
            {isLoading ? (
              <div className="bg-blue-900 p-4 rounded-lg animate-pulse">
                <div className="h-4 bg-blue-800 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-blue-800 rounded w-1/2"></div>
              </div>
            ) : !singleToken  ? (
              <div className="bg-blue-900 p-4 rounded-lg text-center mt-4">
              <p className="text-gray-300">Please select a token to continue</p>
            </div>
          ) : singleTokenInfo ? (
              <>
                {/* Token Info Section */}
                
                
                <div className="bg-blue-900 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold mb-2">Token Information</h3>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Symbol:</span> {singleTokenInfo?.symbol || "Select a token"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Balance:</span> {formatBalance(singleTokenBalance)}
                  </p>
                </div>
                
                {/* Staking Amount */}
                <div className="mt-4 ">
                  <h4 className="text-base font-bold mb-2">
                    Stake Amount: {formatBalance(stakeAmount)}
                  </h4>
                  
                  {/* Percentage selection buttons */}
                 {/* Percentage selection buttons */}
{/* Percentage selection buttons */}
<div className="bg-blue-800 rounded-2xl overflow-hidden shadow-xl">
  
  
  <div className="p-6">
    <div className="text-white text-6xl font-bold text-center mb-6">
      {stakePercentage}%
    </div>
    
    <div className="relative mb-6">
      <input
        type="range"
        min="0"
        max="100"
        value={stakePercentage}
        onChange={(e) => setStakePercentage(Number(e.target.value))}
        className="w-full h-2 bg-blue-800 rounded-full appearance-none cursor-pointer 
          [&::-webkit-slider-runnable-track]:rounded-full 
      [&::-webkit-slider-runnable-track]:h-2 
      [&::-webkit-slider-thumb]:appearance-none 
      [&::-webkit-slider-thumb]:-mt-2.5 
      [&::-webkit-slider-thumb]:h-6 
      [&::-webkit-slider-thumb]:w-6 
      [&::-webkit-slider-thumb]:rounded-full 
      [&::-webkit-slider-thumb]:bg-[url('/Trump.png')] 
      [&::-webkit-slider-thumb]:bg-[length:24px] 
      [&::-webkit-slider-thumb]:bg-no-repeat 
      [&::-webkit-slider-thumb]:bg-center"
        style={{
          background: `linear-gradient(to right, #10b981 ${stakePercentage}%, #1e40af ${stakePercentage}%)`
        }}
      />
    </div>
    
    <div className="grid grid-cols-4 gap-2">
      {[25, 50, 75, 100].map((value) => (
        <button
          key={value}
          onClick={() => setStakePercentage(value)}
          className={`py-3 rounded-lg text-white transition-colors 
            ${stakePercentage === value 
              ? 'bg-green-500' 
              : 'bg-blue-900 hover:bg-blue-800'}`}
        >
          {value === 100 ? 'Max' : `${value}%`}
        </button>
      ))}
    </div>
  </div>
  
 
</div>


                  
<button
  onClick={handleStake}
  disabled={isStakingSingleLoading || BigInt(stakeAmount) <= 0}
  className="w-full bg-green-600 text-white p-4 rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors flex items-center justify-center mt-6"
>
  {isStakingSingleLoading ? (
    <div className="flex items-center justify-center">
      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Processing...
    </div>
  ) : (
    `Stake ${stakePercentage}% of Tokens`
  )}
</button>


                </div>
              </>
            ) : (
              // Display this when no token is selected
              <div className="bg-blue-900 p-4 rounded-lg text-center">
                <p className="text-gray-300">Please select a token to continue</p>
              </div>
            )}
                      {renderSingleStakes()}
          </div>

        )}

        {/* LP Token Staking Section with enhanced UI */}
        {stakingTab === "lp" && (
          <div className="border-2 border-yellow-400 rounded-lg p-4">
            <h2 className="text-xl font-dela mb-4">LP Token Staking</h2>
            
            {/* Token Select Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TokenSelect label="Token 0" onSelect={handleToken0Select} />
              <TokenSelect label="Token 1" onSelect={handleToken1Select} />
            </div>
            
            {isLoading ? (
              <div className="bg-blue-900 p-4 rounded-lg animate-pulse">
                <div className="h-4 bg-blue-800 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-blue-800 rounded w-1/2"></div>
              </div>
            ) : (token0 && token1 && lpBalances.length > 0) ? (
              <>
                {/* LP Token Info Section */}
                <div className="bg-blue-900 p-4 rounded-lg mb-4 mt-4">
                  <h3 className="text-lg font-semibold mb-2">LP Token Information</h3>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Total LP Balance:</span> {formatBalance(totalLpBalance)}
                  </p>
                  
                  {lpBalances.length > 0 ? (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Your LP Tokens:</h4>
                      <div className="max-h-40 overflow-y-auto bg-blue-800 p-2 rounded">
                      {(lpBalances as any[]).map((lp) => (
  <div key={lp.id} className="text-sm text-gray-300 p-2 border-b border-blue-700 last:border-b-0">
    <p><span className="font-medium">Token ID:</span> {lp.id.substring(0, 10)}...</p>
    <p><span className="font-medium">Balance:</span> {formatBalance(lp.balance || '0')}</p>
  </div>
))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic mt-2">No LP tokens found for this pair</p>
                  )}
                </div>
                
                {/* Staking Amount */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Stake Amount: {formatBalance(stakeAmount)}
                  </h4>
                  
                  {/* Percentage selection buttons */}
{/* Percentage selection buttons */}
<div className="bg-blue-800 rounded-2xl overflow-hidden shadow-xl">
  
  
  <div className="p-6">
    <div className="text-white text-6xl font-bold text-center mb-6">
      {stakePercentage}%
    </div>
    
    <div className="relative mb-6">
      <input
        type="range"
        min="0"
        max="100"
        value={stakePercentage}
        onChange={(e) => setStakePercentage(Number(e.target.value))}
        className="w-full h-2 bg-blue-800 rounded-full appearance-none cursor-pointer 
          [&::-webkit-slider-runnable-track]:rounded-full 
      [&::-webkit-slider-runnable-track]:h-2 
      [&::-webkit-slider-thumb]:appearance-none 
      [&::-webkit-slider-thumb]:-mt-2.5 
      [&::-webkit-slider-thumb]:h-6 
      [&::-webkit-slider-thumb]:w-6 
      [&::-webkit-slider-thumb]:rounded-full 
      [&::-webkit-slider-thumb]:bg-[url('/Trump.png')] 
      [&::-webkit-slider-thumb]:bg-[length:24px] 
      [&::-webkit-slider-thumb]:bg-no-repeat 
      [&::-webkit-slider-thumb]:bg-center"
        style={{
          background: `linear-gradient(to right, #10b981 ${stakePercentage}%, #1e40af ${stakePercentage}%)`
        }}
      />
    </div>
    
    <div className="grid grid-cols-4 gap-2">
      {[25, 50, 75, 100].map((value) => (
        <button
          key={value}
          onClick={() => setStakePercentage(value)}
          className={`py-3 rounded-lg text-white transition-colors 
            ${stakePercentage === value 
              ? 'bg-green-500' 
              : 'bg-blue-900 hover:bg-blue-800'}`}
        >
          {value === 100 ? 'Max' : `${value}%`}
        </button>
      ))}
    </div>
  </div>
  
 
</div>
                  
<button
  onClick={handleStake}
  disabled={isStakingLPLoading || lpBalances.length === 0 || BigInt(stakeAmount) <= 0}
  className="w-full bg-green-600 text-white p-4 rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors flex items-center justify-center mt-6"
>
  {isStakingLPLoading ? (
    <div className="flex items-center justify-center">
      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Processing...
    </div>
  ) : (
    `Stake ${stakePercentage}% of LP Tokens`
  )}
</button>


                </div>
              </>
            ) : (
              // Display this when tokens aren't selected or no LP tokens found
              <div className="bg-blue-900 p-4 rounded-lg text-center">
                <p className="text-gray-300">{token0 && token1 ? "No LP tokens found for this pair" : "Please select both tokens to continue"}</p>
              </div>
            )}

{renderLPStakes()}
          </div>
        )}
      
      </div>
    </div>
  );
};