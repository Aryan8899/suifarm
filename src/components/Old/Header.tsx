//new

//import React from "react";
import pic1 from "../photos/pic4.png";
import "../App.css";
// import { Tweet } from "react-tweet";
// import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Autoplay } from "swiper/modules";
// import { Pagination } from "swiper/modules";
//import pic1 from "../photos/pic1.png";
//import { useEffect } from "react";
//import { useWeb3ModalState } from "@web3modal/ethers5/react";
//import { useWeb3Modal } from "@web3modal/ethers5/react";
//import { useCallback } from "react";

const Header = () => {
  const { connected, account, select } = useWallet();
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);

  const handleWalletClick = async (walletName: string) => {
    try {
      await select(walletName);
      setIsWalletDropdownOpen(false);
    } catch (error) {
      console.error("Wallet selection failed:", error);
    }
  };

  const availableWallets = [
    { name: "Suiet" },
    { name: "Sui Wallet" },
    { name: "Ethos Wallet" },
    { name: "Martian Sui Wallet" },
  ];
  const getShortAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };
  return (
    <header className="flex flex-col items-center px-2 py-2 shadow-md relative">
      {/* Logo */}
      <img
        src={pic1}
        alt="trump"
        className="w-[300px] sm:w-[500px] h-[150px] sm:h-[230px] object-contain -mt-6 sm:-mt-10"
      />

      <h2 className="font-dela text-[18px] sm:text-[30px] font-normal tracking-normal leading-[1.2em] text-custombackgr text-center -mt-10 sm:-mt-16 [text-shadow:2px_2px_0px_white,-2px_2px_0px_white,2px_-2px_0px_white,-2px_-2px_0px_white] whitespace-nowrap">
        IT'S ALL ABOUT WINNING
      </h2>
      <div className="absolute top-2 right-2">
        <ConnectButton
          className="sui-connect-button w-full rounded-xl transition-all duration-300"
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            borderRadius: "1rem",
            // padding: connected ? "0.5rem 1rem" : "0.75rem 1.5rem",
            fontSize: connected ? "0.875rem" : "1rem",
            boxShadow: "0 0 10px rgba(34, 197, 94, 0.6)",
          }}
        >
          {connected ? (
            <div className="flex items-center space-x-1">
              <span className="hidden sm:inline-block">
                {getShortAddress(account?.address)}
              </span>
              <span className="inline-block sm:hidden text-ellipsis overflow-hidden max-w-[80px]">
                {getShortAddress(account?.address)}
              </span>
            </div>
          ) : (
            "Connect Wallet"
          )}
        </ConnectButton>
        {isWalletDropdownOpen && !connected && (
          <div className="absolute mt-2 w-[200px] bg-gray-800/95 border border-[#2a4b8a] rounded-lg px-2 shadow-lg z-50">
            <ul className="py-2">
              {availableWallets.map((wallet) => (
                <li
                  key={wallet.name}
                  onClick={() => handleWalletClick(wallet.name)}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                >
                  {wallet.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Disconnect Button for Mobile */}
      {/* {connected && (
          <button
            onClick={disconnect}
            className="bg-red-500 text-white px-4 py-2 rounded mt-2 w-full"
          >
            Disconnect ({getShortAddress(account?.address)})
          </button>
        )} */}
    </header>
  );
};
export default Header;
