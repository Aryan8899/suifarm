// @ts-nocheck

import { useState, useEffect } from 'react';
import { useWallet } from "@suiet/wallet-kit"; // Use Suiet Wallet instead of dapp-kit
import { useSuiClient } from '@mysten/dapp-kit'; // We can still use this
import { CONSTANTS } from '../constants/addresses';
import { toast } from 'sonner';
import { Transaction } from '@mysten/sui/transactions';



export default function UserStakesComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [userStakes, setUserStakes] = useState([]);
  const [lpStakes, setLpStakes] = useState([]);
  const [singleAssetStakes, setSingleAssetStakes] = useState([]);
  const [error, setError] = useState(null);
  const [isClaimingRewards, setIsClaimingRewards] = useState(null);
  const [isUnstaking, setIsUnstaking] = useState(null);
  
  // Use Suiet wallet hooks instead of dapp-kit hooks
  const { connected, account, signAndExecuteTransactionBlock } = useWallet();
  const suiClient = useSuiClient();

  // Helper function to format dates
  const formatDate = (timestamp:string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  // Helper function to format balance with appropriate decimals
  const formatBalance = (balance: string | number, decimals = 9) => {
    try {
      return (Number(balance) / Math.pow(10, decimals)).toFixed(6);
    } catch (e) {
      console.error("Error formatting balance:", e);
      return "0.000000";
    }
  };
  
  // Helper function specifically for VICTORY token with 18 decimals
  const formatVictoryBalance = (balance: string | number) => {
    try {
      return (Number(balance) / Math.pow(10, 18)).toFixed(6);
    } catch (e) {
      console.error("Error formatting VICTORY balance:", e);
      return "0.000000";
    }
  };
  
  // Helper function to format token balances based on token type
  const formatTokenBalance = (balance: string | number, tokenType: string) => {
    // SUI uses 9 decimals
    if (tokenType === '0x2::sui::SUI') {
      return formatBalance(balance, 9);
    }
    // LP tokens typically use 9 decimals
    else if (tokenType.includes('::pair::LPCoin<')) {
      return formatBalance(balance, 9);
    }
    // VICTORY token uses 18 decimals
    else if (tokenType.includes('::victory_token::VICTORY_TOKEN')) {
      return formatVictoryBalance(balance);
    }
    // Default for other tokens
    return formatBalance(balance, 9);
  };

  const getTokenInfo = async (tokenType: string) => {
    try {
      // Check if it's a LP token
      if (tokenType.includes('::pair::LPCoin<')) {
        // Extract the token types from LP
        const match = tokenType.match(/LPCoin<(.+),\s*(.+)>/);
        if (match) {
          const token0Type = match[1].trim();
          const token1Type = match[2].trim().replace('>', '');
          
          return {
            name: `LP ${token0Type.split('::').pop()}/${token1Type.split('::').pop()}`,
            symbol: 'LP',
            type: tokenType,
            isLp: true,
            token0Type,
            token1Type
          };
        }
      }
      
      // For single tokens, try to fetch metadata if possible
      // For SUI token, hardcode the metadata
      if (tokenType === '0x2::sui::SUI') {
        return {
          name: 'Sui',
          symbol: 'SUI',
          type: tokenType,
          isLp: false
        };
      }
      
      // For other tokens, we would need to fetch from the blockchain
      // This is a simplified approach
      return {
        name: tokenType.split('::').pop(),
        symbol:(tokenType?.split('::')?.pop() || '')?.substring(0, 3)?.toUpperCase() || 'UNK',
        type: tokenType,
        isLp: false
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      return {
        name: 'Unknown Token',
        symbol: '???',
        type: tokenType,
        isLp: tokenType.includes('::pair::LPCoin<')
      };
    }
  };
  
  // Function to fetch all user stakes
  const fetchUserStakes = async () => {
    if (!account?.address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Query specifically for StakingPosition objects owned by the user
      const stakingPositions = await suiClient.getOwnedObjects({
        owner: account.address,
        filter: {
          StructType: `${CONSTANTS.PACKAGE_ID}::farm::StakingPosition`
        },
        options: { showType: true, showContent: true, showOwner: true }
      });
      
      if (!stakingPositions || !stakingPositions.data) {
        console.log("No staking positions found or invalid response");
        setUserStakes([]);
        setLpStakes([]);
        setSingleAssetStakes([]);
        setIsLoading(false);
        return;
      }
      
      console.log('Found staking positions:', stakingPositions);
      
      // For each position, fetch additional data
      const positionDetails = await Promise.all(stakingPositions.data.map(async (pos) => {
        try {
          if (!pos.data?.content?.fields) {
            console.log("Skipping position without content fields:", pos);
            return null;
          }
          
          const positionData = pos.data.content.fields;
          const positionId = pos.data.objectId;
          const vaultId = positionData.vault_id;
          const poolType = positionData.pool_type;
          const amount = positionData.amount;
          const initialStakeTimestamp = positionData.initial_stake_timestamp;
          
          // Get token info
          const tokenType = poolType.fields?.name;
          if (!tokenType) {
            console.log("Skipping position without token type:", pos);
            return null;
          }
          
          const tokenInfo = await getTokenInfo(tokenType);
          
          // Try to get the vault object to see balance
          let vaultData = null;
          try {
            const vault = await suiClient.getObject({
              id: vaultId,
              options: { showContent: true }
            });
            
            if (vault.data) {
              vaultData = vault.data.content.fields;
            }
          } catch (e) {
            console.warn(`Could not fetch vault data for ${vaultId}:`, e);
          }
          
          // Try to get pending rewards using the move call
          let pendingRewards = '0';
          try {
            // Create a transaction for the devInspect call
            const tx = new Transaction();
            
            // Determine if this is LP or single asset position
            if (tokenInfo.isLp) {
              // Extract the token types from LP
              const match = tokenInfo.type.match(/LPCoin<(.+),\s*(.+)>/);
              if (match) {
                const token0Type = match[1].trim();
                const token1Type = match[2].trim().replace('>', '');
                
                // Add call to get_pending_rewards for LP token
                tx.moveCall({
                  target: `${CONSTANTS.PACKAGE_ID}::farm::get_pending_rewards`,
                  typeArguments: [`${CONSTANTS.PACKAGE_ID}::pair::LPCoin<${token0Type}, ${token1Type}>`],
                  arguments: [
                    tx.object(CONSTANTS.FARM_ID),
                    tx.pure.address(account.address)
                  ]
                });
              }
            } else {
              // Add call to get_pending_rewards for single asset
              tx.moveCall({
                target: `${CONSTANTS.PACKAGE_ID}::farm::get_pending_rewards`,
                typeArguments: [tokenInfo.type],
                arguments: [
                  tx.object(CONSTANTS.FARM_ID),
                  tx.pure.address(account.address)
                ]
              });
            }
            
            // Execute the function call in readonly mode
            const result = await suiClient.devInspectTransactionBlock({
              transactionBlock: tx,
              sender: account.address
            });
            
            console.log('Inspect result:', result);
            
            // Parse the result - extract the return value from the result
            if (result && result.results && result.results.length > 0 && result.results[0].returnValues) {
              const returnValue = result.results[0].returnValues[0];
              console.log('Return value:', returnValue);
              
              if (result && result.results && result.results.length > 0 && result.results[0].returnValues) {
                const returnValue = result.results[0].returnValues[0];
                console.log('Return value type:', typeof returnValue);
                console.log('Return value:', JSON.stringify(returnValue));
                
                try {
                  let parsedValue = '0';
                  
                  // Handle different return formats
                  if (Array.isArray(returnValue)) {
                    if (returnValue.length > 0) {
                      if (Array.isArray(returnValue[0])) {
                        // Case: [[1,2,3], "type"]
                        // Convert array of numbers to a proper number
                        // This is a safer approach than joining
                        const numberArray = returnValue[0];
                        parsedValue = BigInt(numberArray.reduce((acc, val, idx) => {
                          return acc + BigInt(val) * BigInt(256) ** BigInt(idx);
                        }, BigInt(0))).toString();
                      } else {
                        // Case: [12345, "type"]
                        parsedValue = returnValue[0].toString();
                      }
                    }
                  } else if (typeof returnValue === 'object' && returnValue !== null) {
                    // Handle object format if present
                    if ('U64' in returnValue) {
                      parsedValue = returnValue.U64;
                    } else if ('U128' in returnValue) {
                      parsedValue = returnValue.U128;
                    } else if ('U256' in returnValue) {
                      parsedValue = returnValue.U256;
                    }
                  } else if (typeof returnValue === 'number' || typeof returnValue === 'bigint') {
                    // Direct number or bigint
                    parsedValue = returnValue.toString();
                  } else if (typeof returnValue === 'string') {
                    // Direct string that should represent a number
                    parsedValue = returnValue;
                  }
                  
                  console.log('Parsed reward value:', parsedValue);
                  pendingRewards = parsedValue;
                  
                  // Validation check
                  if (BigInt(pendingRewards) > BigInt("1000000000000000000000000")) {
                    console.warn("Extremely high rewards detected, may indicate contract calculation issue");
                  }
                } catch (parseError) {
                  console.error('Error parsing return value:', parseError);
                  pendingRewards = '0';
                }
              }
            }
          } catch (e) {
            console.warn('Could not fetch pending rewards:', e);
          }
          
          return {
            id: positionId,
            type: tokenInfo.isLp ? 'lp' : 'single',
            tokenInfo,
            amount,
            amountFormatted: formatTokenBalance(amount, tokenInfo.type),
            initialStakeTimestamp,
            stakeDateFormatted: formatDate(initialStakeTimestamp),
            vaultId,
            vaultData,
            pendingRewards,
            pendingRewardsFormatted: formatVictoryBalance(pendingRewards)
          };
        } catch (error) {
          console.error(`Error processing position ${pos.data?.objectId}:`, error);
          return null;
        }
      }));
      
      // Filter out any null results from errors
      const validPositions = positionDetails.filter(p => p !== null);
      
      // Separate LP and single asset stakes
      const lpPositions = validPositions.filter(p => p.type === 'lp');
      const singlePositions = validPositions.filter(p => p.type === 'single');
      
      // Sort positions by timestamp (newest first)
// Replace your current sortByTimestamp function with this
// Sort by timestamp (newest first), then by amount (highest first)
const sortByTimestamp = (positions) => {
    return [...positions].sort((a, b) => {
      // First compare by timestamp
      const timeA = parseInt(a.initialStakeTimestamp);
      const timeB = parseInt(b.initialStakeTimestamp);
      
      if (timeB !== timeA) {
        return timeB - timeA; // Newest first
      }
      
      // If timestamps are the same, sort by amount (highest first)
      const amountA = BigInt(a.amount);
      const amountB = BigInt(b.amount);
      
      if (amountB !== amountA) {
        return amountB > amountA ? 1 : -1;
      }
      
      // If both timestamp and amount are the same, sort by ID
      return b.id.localeCompare(a.id);
    });
  };
  
  // Then use this function instead
  const sortedValidPositions = sortByTimestamp(validPositions);
  const sortedLpPositions = sortByTimestamp(lpPositions);
  const sortedSinglePositions = sortByTimestamp(singlePositions);
  
  console.log('Processed positions:', sortedValidPositions);
  console.log('LP positions:', sortedLpPositions);
  console.log('Single asset positions:', sortedSinglePositions);
  
  setUserStakes(sortedValidPositions);
  setLpStakes(sortedLpPositions);
  setSingleAssetStakes(sortedSinglePositions);
    } catch (error) {
      console.error('Error fetching user stakes:', error);
      setError('Failed to load your staked positions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data when component mounts or account changes
  useEffect(() => {
    if (account?.address) {
      fetchUserStakes();
    }
  }, [account?.address]);
  
  // Function to handle claiming rewards
  const handleClaimRewards = async (position) => {
    if (!account?.address) return;
    setIsClaimingRewards(position.id);
    const toastId = toast.loading('Processing claim...');
    
    try {
      const tx = new Transaction();
      
      // Determine if LP or single asset position
      if (position.type === 'lp') {
        // Extract token types for LP
        const lpTokenType = position.tokenInfo.type;
        const match = lpTokenType.match(/LPCoin<(.+),\s*(.+)>/);
        if (match) {
          const token0Type = match[1].trim();
          const token1Type = match[2].trim().replace('>', '');
          
          // Call the claim_rewards_lp function
          tx.moveCall({
            target: `${CONSTANTS.PACKAGE_ID}::farm::claim_rewards_lp`,
            typeArguments: [token0Type, token1Type],
            arguments: [
              tx.object(CONSTANTS.FARM_ID),
              tx.object(position.id),
              tx.object(CONSTANTS.VICTORY_TOKEN.TREASURY_CAP_WRAPPER_ID)
            ]
          });
        }
      } else {
        // Call the claim_rewards_single function
        tx.moveCall({
          target: `${CONSTANTS.PACKAGE_ID}::farm::claim_rewards_single`,
          typeArguments: [position.tokenInfo.type],
          arguments: [
            tx.object(CONSTANTS.FARM_ID),
            tx.object(position.id),
            tx.object(CONSTANTS.VICTORY_TOKEN.TREASURY_CAP_WRAPPER_ID)
          ]
        });
      }
      
      // Execute transaction using Suiet wallet
      const txResult = await signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      
      if (txResult?.digest) {
        toast.dismiss(toastId);
        toast.success('Successfully claimed rewards');
        setTimeout(() => fetchUserStakes(), 2000);
      } else {
        toast.dismiss(toastId);
        toast.error('Transaction failed');
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error('Error claiming rewards:', error);
      toast.error(error.message || 'Failed to claim rewards');
    } finally {
      setIsClaimingRewards(null);
    }
  };
  
  // Function to handle unstaking
  const handleUnstake = async (position) => {
    if (!account?.address) return;
    
    // For full unstake example - in a real app you would allow partial unstaking with an input
    const amountToUnstake = position.amount;
    
    setIsUnstaking(position.id);
    const toastId = toast.loading('Processing unstake...');
    
    try {
      const tx = new Transaction();
      
      // Determine if LP or single asset position
      if (position.type === 'lp') {
        // Extract token types for LP
        const lpTokenType = position.tokenInfo.type;
        const match = lpTokenType.match(/LPCoin<(.+),\s*(.+)>/);
        if (match) {
          const token0Type = match[1].trim();
          const token1Type = match[2].trim().replace('>', '');
          
          // Call the unstake_lp function
          tx.moveCall({
            target: `${CONSTANTS.PACKAGE_ID}::farm::unstake_lp`,
            typeArguments: [token0Type, token1Type],
            arguments: [
              tx.object(CONSTANTS.FARM_ID),
              tx.object(position.id),
              tx.object(position.vaultId),
              tx.pure.u256(amountToUnstake),
              tx.object(CONSTANTS.VICTORY_TOKEN.TREASURY_CAP_WRAPPER_ID)
            ]
          });
        }
      } else {
        // Call the unstake_single function
        tx.moveCall({
          target: `${CONSTANTS.PACKAGE_ID}::farm::unstake_single`,
          typeArguments: [position.tokenInfo.type],
          arguments: [
            tx.object(CONSTANTS.FARM_ID),
            tx.object(position.id),
            tx.object(position.vaultId),
            tx.pure.u256(amountToUnstake),
            tx.object(CONSTANTS.VICTORY_TOKEN.TREASURY_CAP_WRAPPER_ID)
          ]
        });
      }
      
      // Execute transaction using Suiet wallet
      const txResult = await signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      
      if (txResult?.digest) {
        toast.dismiss(toastId);
        toast.success('Successfully unstaked tokens');
        setTimeout(() => fetchUserStakes(), 2000);
      } else {
        toast.dismiss(toastId);
        toast.error('Transaction failed');
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error('Error unstaking:', error);
      toast.error(error.message || 'Failed to unstake tokens');
    } finally {
      setIsUnstaking(null);
    }
  };

  // Render the single token stakes component (to be used within Farm.tsx)
  const renderSingleStakes = () => {
    if (isLoading) {
      return (
        <div className="bg-blue-900 p-4 rounded-lg animate-pulse mt-4">
          <div className="h-4 bg-blue-800 rounded w-3/4 mb-3"></div>
          <div className="h-20 bg-blue-800 rounded mb-3"></div>
          <div className="h-20 bg-blue-800 rounded"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-blue-900 p-4 rounded-lg text-center mt-4">
          <p className="text-red-400">{error}</p>
        </div>
      );
    }

    if (singleAssetStakes.length === 0) {
      return (
        <div className="bg-blue-900 p-4 rounded-lg text-center mt-4">
          <p className="text-gray-300">You don't have any staked single tokens</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-4">
        <h3 className="text-lg font-dela text-white">Your Single Token Stakes</h3>
        {singleAssetStakes.map((position) => (
          <div key={position.id} className="bg-blue-900 p-4 rounded-lg border border-yellow-400">
            <div className="flex justify-between mb-2">
              <div className="font-medium text-white">{position.tokenInfo.name}</div>
              <div className="text-sm text-gray-300">ID: {position.id.substring(0, 8)}...</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-sm text-gray-300">Amount</p>
                <p className="font-medium text-white">{position.amountFormatted} {position.tokenInfo.symbol}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Staked On</p>
                <p className="text-white">{position.stakeDateFormatted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Pending Rewards</p>
                <p className="font-medium text-green-400">{position.pendingRewardsFormatted} VICTORY</p>
              </div>
            </div>
            
            <div className="flex gap-2">
            <button 
  onClick={() => handleClaimRewards(position)}
  disabled={isClaimingRewards === position.id}
  className="bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-3 rounded-lg font-medium transition-all flex-1 flex justify-center items-center border-2 border-blue-400 shadow-lg transform hover:scale-105"
>
  {isClaimingRewards === position.id ? (
    <div className="flex items-center justify-center">
      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
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
  ) : "Claim Rewards"}
</button>
<button 
  onClick={() => handleUnstake(position)}
  disabled={isUnstaking === position.id}
  className="bg-indigo-700/60 backdrop-blur-sm hover:bg-indigo-900 text-white px-4 py-3 rounded-lg font-medium transition-all flex-1 flex justify-center items-center border border-blue-400 shadow-lg transform hover:scale-105"
>
  {isUnstaking === position.id ? (
    <div className="flex items-center justify-center">
      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
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
  ) : "Unstake"}
</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render the LP token stakes component (to be used within Farm.tsx)
  const renderLPStakes = () => {
    if (isLoading) {
      return (
        <div className="bg-blue-900 p-4 rounded-lg animate-pulse mt-4">
          <div className="h-4 bg-blue-800 rounded w-3/4 mb-3"></div>
          <div className="h-20 bg-blue-800 rounded mb-3"></div>
          <div className="h-20 bg-blue-800 rounded"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-blue-900 p-4 rounded-lg text-center mt-4">
          <p className="text-red-400">{error}</p>
        </div>
      );
    }

    if (lpStakes.length === 0) {
      return (
        <div className="bg-blue-900 p-4 rounded-lg text-center mt-4">
          <p className="text-gray-300">You don't have any staked LP tokens</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-4">
        <h3 className="text-lg font-dela text-white">Your LP Token Stakes</h3>
        {lpStakes.map((position) => (
          <div key={position.id} className="bg-blue-900 p-4 rounded-lg border border-yellow-400">
            <div className="flex justify-between mb-2">
              <div className="font-medium text-white">{position.tokenInfo.name}</div>
              <div className="text-sm text-gray-300">ID: {position.id.substring(0, 8)}...</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-sm text-gray-300">Amount</p>
                <p className="font-medium text-white">{position.amountFormatted} {position.tokenInfo.symbol}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Staked On</p>
                <p className="text-white">{position.stakeDateFormatted}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Pending Rewards</p>
                <p className="font-medium text-green-400">{position.pendingRewardsFormatted} VICTORY</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Token Pair</p>
                <p className="text-xs text-white break-all">
                  {position.tokenInfo.token0Type?.split('::').pop()}/{position.tokenInfo.token1Type?.split('::').pop()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleClaimRewards(position)}
                disabled={isClaimingRewards === position.id}
                className="bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-3 rounded-lg font-medium transition-all flex-1 flex justify-center items-center border-2 border-blue-400 shadow-lg transform hover:scale-105"
              >
                {isClaimingRewards === position.id ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                ) : "Claim Rewards"}
              </button>
              <button 
                onClick={() => handleUnstake(position)}
                disabled={isUnstaking === position.id}
                className="bg-indigo-700/60 backdrop-blur-sm hover:bg-indigo-900 text-white px-4 py-3 rounded-lg font-medium transition-all flex-1 flex justify-center items-center border border-blue-400 shadow-lg transform hover:scale-105"
              >
                {isUnstaking === position.id ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                ) : "Unstake"}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Return data and functions to be used in Farm component
  return {
    fetchUserStakes,
    isLoading,
    singleAssetStakes,
    lpStakes,
    renderSingleStakes,
    renderLPStakes,
    refreshStakes: fetchUserStakes
  };
}