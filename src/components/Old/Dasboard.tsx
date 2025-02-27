//new

//import React from "react";
// import pic1 from "../photos/pic4.png";
import "../App.css";
import { Tweet } from "react-tweet";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Pagination } from "swiper/modules";
//import pic1 from "../photos/pic1.png";
//import { useEffect } from "react";
//import { useWeb3ModalState } from "@web3modal/ethers5/react";
//import { useWeb3Modal } from "@web3modal/ethers5/react";
//import { useCallback } from "react";

const Dashboard = () => {
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
    <div className=" min-h-screen  text-white space-y-4">
      {/* Header */}
      <div className="rotating-background"></div>

      {/* <header className="flex flex-col items-center px-2 py-2 shadow-md relative">
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
      </header> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farming & Staking Section */}
        <div className="bg-blue-950 p-6 rounded-xl shadow-lg text-center flex flex-col justify-between border border-yellow-400 h-full relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            {/* Left Side - Text Content */}
            <div className="text-left px-2 relative z-10">
              <h2 className="text-3xl font-dela tracking-wider uppercase text-blue-300 mb-4">
                Farming & Staking
              </h2>
              <p className="text-lg font-poppins text-white mb-1">
                VICTORY to Harvest
              </p>
              <h3 className="text-4xl md:text-4xl font-dela text-white">
                0.000
              </h3>
              <p className="text-sm text-gray-400 font-dela">~$0.00</p>

              <p className="text-lg font-poppins text-white mt-6 mb-1">
                VICTORY in Wallet
              </p>
              <h3 className="text-4xl font-dela text-white">0.000</h3>
              <p className="text-sm text-gray-400 font-dela">~$0.00</p>

              <div className="mt-6 md:mt-8  transition-all w-full sm:w-auto">
                <ConnectButton
                  className="sui-connect-button  w-full rounded-xl transition-all duration-300   "
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
                  <div className=" w-[200px] bg-gray-800/95 border border-[#2a4b8a] rounded-lg px-2 shadow-lg z-50">
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
            </div>

            {/* Right Side - Logo */}
            <div
              className="hidden sm:block absolute inset-0 bg-cover bg-left opacity-40"
              style={{
                backgroundImage: `url('https://framerusercontent.com/images/PX7OJIh09S4xt8yZNa9dVpjGoE.png')`,
              }}
            ></div>

            {/* Mobile-Specific Background */}
            <div
              className="block sm:hidden absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage: `url('https://framerusercontent.com/images/PX7OJIh09S4xt8yZNa9dVpjGoE.png')`,
              }}
            ></div>
          </div>
        </div>

        {/* Announcements Section */}
        <div className="bg-blue-950 p-6 rounded-xl shadow-lg text-center flex flex-col justify-between relative border border-yellow-400">
          <h2 className="text-3xl font-dela tracking-wide text-blue-300 mb-4">
            Announcements
          </h2>
          <iframe
            src="https://dexscreener.com/sui/0x2c2bbe5623c66e9ddf39185d3ab5528493c904b89c415df991aeed73c2427aa9?embed=1&theme=dark&trades=0&info=0"
            title="Dex Screener Chart"
            className="w-full h-[400px] rounded-md border border-gray-700"
          ></iframe>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AtroVICTORY Stats */}
        <div className="bg-blue-950 p-6 rounded-lg shadow-lg border border-yellow-400">
          <h2 className="text-2xl font-dela mb-4 text-blue-300">
            Sui Trump Farm Stats
          </h2>
          <ul className="space-y-2 mt-12">
            <li className="flex justify-between">
              <span className="text-blue-300 font-poppins">Market Cap</span>
              <span className="font-dela">$475,605</span>
            </li>
            <li className="flex justify-between">
              <span className="text-blue-300 font-poppins">
                Total Liquidity
              </span>
              <span className="font-dela">$747,994</span>
            </li>
            <li className="flex justify-between">
              <span className="text-blue-300 font-poppins">Total Minted</span>
              <span className="font-dela">27,555,347,489</span>
            </li>
            <li className="flex justify-between">
              <span className="text-blue-300 font-poppins">
                Circulating Supply
              </span>
              <span className="font-dela">24,233,553,850</span>
            </li>
            <li className="flex justify-between">
              <span className="text-blue-300 font-poppins">
                New VICTORY/block
              </span>
              <span className="font-dela">13,000</span>
            </li>
          </ul>
        </div>

        {/* Total Value Locked Section */}
        <div className="bg-blue-950 p-4 sm:p-6 rounded-lg shadow-lg border border-yellow-400">
          <h2 className="font-dela mb-4 text-blue-300 text-xl sm:text-2xl text-center">
            Twitter Feed
          </h2>

          {/* Swiper Slider */}
          <Swiper
            autoplay={{
              delay: 3000, // 5 seconds delay
              disableOnInteraction: false, // Autoplay continues after user interaction
            }}
            pagination={{ clickable: true }}
            loop={true} // Enables infinite loop
            modules={[Autoplay, Pagination]} // Import Autoplay & Pagination modules
            className="mySwiper mobile-container"
          >
            <SwiperSlide>
              <div className="tweet-container px-2">
                <Tweet id="1868928300820971833" />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="tweet-container px-2">
                <Tweet id="1847033499515244544" />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="tweet-container px-2">
                <Tweet id="1868101777171923259" />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
