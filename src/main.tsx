import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

// 1. Your WalletConnect Cloud project ID
const projectId = "cfbff28144e76635be4f2d72ad72c548";

// 2. Set chains (use BSC Testnet here)
const testnet = {
  chainId: 97, // BSC Testnet Chain ID
  name: "BSC Testnet", // Name of the chain
  currency: "BNB", // Currency used in the BSC Testnet
  explorerUrl: "https://testnet.bscscan.com", // Block Explorer URL for BSC Testnet
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/", // RPC URL for BSC Testnet
};

const metadata = {
  name: "Trade Market Cap",
  description: "Trade Market Cap",
  url: "https://trademarketcap.ai/", // origin must match your domain & subdomain
  icons: ["./apple-touch-icon.png"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: 97,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true
});

console.log("Ethers Config:", ethersConfig);
console.log("Testnet configuration:", testnet);

try {
  console.log('Creating Web3Modal instance...');
  // 5. Create a Web3Modal instance
  // Modify your Web3Modal creation
createWeb3Modal({
  ethersConfig, 
  chains: [testnet], 
  projectId, 
  enableAnalytics: true,
  
});

  console.log('Web3Modal instance created successfully');
} catch (error) {
  console.error('Error creating Web3Modal:', error);
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('Root element not found');
} else {
  console.log('Root element found, rendering app...');
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering the app:', error);
  }
}
