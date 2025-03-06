import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useWallet } from "@suiet/wallet-kit";
import { useSuiClient } from '@mysten/dapp-kit';

interface TokenSelectProps {
  onSelect: (tokenId: string) => void;
  label: string;
}

interface TokenInfo {
  id: string;
  type: string;
  metadata?: {
    name: string;
    symbol: string;
    iconUrl?: string;
  }
}

const DEFAULT_TOKEN_IMAGE = "https://assets.crypto.ro/logos/sui-sui-logo.png";

// Default logos for specific tokens (fallback)
const DEFAULT_TOKEN_LOGOS: { [key: string]: string } = {
  'SUI': 'https://assets.coingecko.com/coins/images/26375/standard/sui_asset.jpeg',
  'USDC': 'https://assets.coingecko.com/coins/images/6319/standard/USD_Coin_icon.png',
  'USDT': 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
  'ETH': 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
  'WETH': 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
  'BTC': 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png',
  'WBTC': 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png'
};

// Generic placeholder generator
const generatePlaceholderLogo = (symbol: string) => 
  `https://assets.crypto.ro/logos/sui-sui-logo.png`;

export function TokenSelect({ onSelect, label }: TokenSelectProps) {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const suiClient = useSuiClient();
  const { account } = useWallet();
  

  useEffect(() => {
    async function getTokens() {
      if (!account) return;

      try {
        const objects = await suiClient.getOwnedObjects({
          owner: account.address,
          options: {
            showType: true,
            showContent: true,
            showDisplay: true
          }
        });

        const coinPromises = objects.data
          .filter(obj => obj.data && obj.data.type?.includes('::coin::'))
          .map(async (obj) => {
            const typeString = obj.data!.type!; // Tell TypeScript you're sure it's not null/undefined
            // Use typeString
            
            const [, , coinType] = typeString.split('<')[1].split('>')[0].split('::');

            try {
              const metadata = await suiClient.getCoinMetadata({
                coinType: typeString.split('<')[1].split('>')[0]
              });

              // Determine the logo
              let iconUrl;
              if (metadata?.iconUrl) {
                // Priority 1: Use iconUrl from metadata
                iconUrl = metadata.iconUrl;
              } else if (DEFAULT_TOKEN_LOGOS[coinType]) {
                // Priority 2: Use predefined logo
                iconUrl = DEFAULT_TOKEN_LOGOS[coinType];
              } else {
                // Priority 3: Generate placeholder
                iconUrl = generatePlaceholderLogo(coinType);
              }

              return {
                id: obj.data!.objectId,
                type: typeString,
                metadata: {
                  name: metadata?.name || coinType,
                  symbol: metadata?.symbol || coinType,
                  iconUrl: iconUrl
                }
              };
            } catch (err) {
              // Fallback for metadata fetch failure
              return {
                id: obj.data!.objectId,
                type: typeString,
                metadata: {
                  name: coinType,
                  symbol: coinType,
                  iconUrl: generatePlaceholderLogo(coinType)
                }
              };
            }
          });

        const tokenObjects = await Promise.all(coinPromises);
        setTokens(tokenObjects);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    }

    getTokens();
  }, [suiClient, account]);

  const handleTokenSelect = (token: TokenInfo) => {
    setSelectedToken(token);
    onSelect(token.id);
    setIsOpen(false);
  };

  const filteredTokens = tokens.filter(token => 
    token.metadata?.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.metadata?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg border border-blue-700 flex items-center justify-between"
      >
        {selectedToken ? (
          <div className="flex items-center">
            <img 
              src={selectedToken.metadata?.iconUrl} 
              alt={selectedToken.metadata?.symbol} 
              className="w-6 h-6 rounded-full mr-3 object-cover"
              onError={(e) => {
                const imgElement = e.target as HTMLImageElement;
                imgElement.src = generatePlaceholderLogo(selectedToken.metadata?.symbol || 'Token');
              }}
            />
            <span>{selectedToken.metadata?.symbol}</span>
          </div>
        ) : (
          <span>Select a Token</span>
        )}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-blue-400" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
<br/>
      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog 
          as="div" 
          {...{ className: "relative z-50" } as any}
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-blue-950/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-blue-900 p-6 text-left align-middle shadow-2xl transition-all border border-blue-700">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title 
                      as="h3" 
                      {...{ className: "text-lg font-medium leading-6 text-white" } as any}
                    >
                      Select a Token
                    </Dialog.Title>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="text-blue-400 hover:text-white transition-colors"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="mb-4 relative">
                    <input 
                      type="text" 
                      placeholder="Search tokens" 
                      className="w-full bg-blue-950 text-white py-2 px-4 rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 flex items-center space-x-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <div className="w-px h-4 bg-blue-700"></div>
                      <button className="text-xs text-blue-400 hover:text-white">All</button>
                    </div>
                  </div>

                  {/* Token List */}
                  <div className="max-h-64 overflow-y-auto pr-2">
                    {filteredTokens.length === 0 ? (
                      <div className="text-center text-blue-400 py-4">
                        No tokens found
                      </div>
                    ) : (
                      filteredTokens.map((token) => (
                        <button
                          key={token.id}
                          onClick={() => handleTokenSelect(token)}
                          className="w-full flex items-center py-2 px-2 hover:bg-blue-800 rounded-lg transition-colors group"
                        >
                          <img 
                            src={token.metadata?.iconUrl || DEFAULT_TOKEN_IMAGE} 
                            alt={token.metadata?.symbol} 
                            className="w-8 h-8 rounded-full mr-3 border border-blue-700 object-cover"
                            onError={(e) => {
                              const imgElement = e.target as HTMLImageElement;
                              imgElement.src = generatePlaceholderLogo(token.metadata?.symbol || 'Token');
                            }}
                          />
                          <div className="text-left flex-1">
                            <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                              {token.metadata?.symbol}
                            </div>
                            <div className="text-sm text-blue-400">
                              {token.metadata?.name}
                            </div>
                          </div>
                          <div className="text-xs text-blue-500 ml-2">
                            {/* You can add balance here if needed */}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}