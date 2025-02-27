import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaExchangeAlt,
  FaTractor,
  FaInfoCircle,
  FaEllipsisH,
  FaBars,
  FaTimes,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import pic1 from "../../assets/images/pic3.png";
import pic2 from "../../assets/images/pic2.png";
import pic5 from "../../assets/images/pic5.png";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [farmOpen, setFarmOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="flex">
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-yellow-500 text-white rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-custombackgr text-black flex flex-col py-4 px-4 border-r-2 border-yellow-400 z-40 
        transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static overflow-y-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-5">
          <img
            src={pic1}
            alt="logo"
            className="w-[300px] sm:w-[500px] h-[150px] sm:h-[120px] object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-2 text-lg bg-customBlue rounded-lg hover:bg-customgreen transition duration-300"
          >
            <FaHome />
            <span>Home</span>
          </Link>

          {/* Trade Dropdown */}
          <div>
            <button
              onClick={() => setTradeOpen(!tradeOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-lg bg-customBlue rounded-lg hover:bg-customgreen transition duration-300"
            >
              <div className="flex items-center space-x-3">
                <FaExchangeAlt />
                <span>Trade</span>
              </div>
              <span>{tradeOpen ? "▲" : "▼"}</span>
            </button>
            {tradeOpen && (
              <div className="mt-1 space-y-1 bg-customBlue rounded px-4 py-2">
                <a
                  href="https://suidex-sigma.vercel.app/#/swap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-green-400"
                >
                  Exchange
                </a>
                <a
                  href="https://suidex-sigma.vercel.app/#/addliquidity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-green-400"
                >
                  Liquidity
                </a>
              </div>
            )}
          </div>

          {/* Farms Dropdown */}
          <div>
            <button
              onClick={() => setFarmOpen(!farmOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-lg bg-customBlue rounded-lg hover:bg-customgreen transition duration-300"
            >
              <div className="flex items-center space-x-3">
                <FaTractor />
                <span>Farms</span>
              </div>
              <span>{farmOpen ? "▲" : "▼"}</span>
            </button>
            {farmOpen && (
              <div className="mt-1 space-y-1 bg-customBlue rounded px-4 py-2">
                <Link to="/farm" className="block hover:text-green-400">
                  Farms
                </Link>
              </div>
            )}
          </div>

          {/* Info Dropdown */}
          <div>
            <button
              onClick={() => setInfoOpen(!infoOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-lg bg-customBlue rounded-lg hover:bg-customgreen transition duration-300"
            >
              <div className="flex items-center space-x-3">
                <FaInfoCircle />
                <span>Info</span>
              </div>
              <span>{infoOpen ? "▲" : "▼"}</span>
            </button>
            {infoOpen && (
              <div className="mt-1 space-y-1 bg-customBlue rounded px-4 py-2">
                <a
                  href="https://pulsex.mypinata.cloud/ipfs/bafybeiesh56oijasgr7creubue6xt5anivxifrwd5a5argiz4orbed57qi/#/info/token/0xe846884430d527168b4eaac80af9268515d2f0cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-green-400"
                >
                  Pulsex
                </a>
                <a
                  href="https://dexscreener.com/pulsechain/0x0e4b3d3141608ebc730ee225666fd97c833d553e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-green-400"
                >
                  DexScreener
                </a>
              </div>
            )}
          </div>

          {/* More Dropdown */}
          <div>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-lg bg-customBlue rounded-lg hover:bg-customgreen transition duration-300"
            >
              <div className="flex items-center space-x-3">
                <FaEllipsisH />
                <span>More</span>
              </div>
              <span>{moreOpen ? "▲" : "▼"}</span>
            </button>
            {moreOpen && (
              <div className="mt-1 space-y-1 bg-customBlue rounded px-4 py-2">
                <a
                  href="https://shitcoin-club.gitbook.io/suitrump-farm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-green-400"
                >
                  Gitbook
                </a>
                <a
                  href="https://atropine.gitbook.io/atropine/specs/security/audits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-green-400"
                >
                  FAQ
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="mt-auto">
          <p className="text-sm text-gray-200 mt-8 ">Audited by:</p>
          <div className="flex items-center justify-center mt-2">
            <img src={pic2} alt="Auditor Logo" className="h-full w-full" />
          </div>
          <img
            src="https://atropine.io/static/media/tech-rate.5f5b2d0902dbdef96856.png"
            alt="Tech Rate Logo"
            className="mt-4"
          />

          {/* Price and Social Icons */}
          <div className="mt-8 border-t border-yellow-400 pt-4">
            <div className="flex items-center justify-around">
              <a
                href="https://dexscreener.com/sui/0x2c2bbe5623c66e9ddf39185d3ab5528493c904b89c415df991aeed73c2427aa9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-yellow-500 hover:text-green-400 transition duration-300"
              >
                <img
                  src={pic5}
                  alt="victorylogo0"
                  className="w-10 h-10 object-contain"
                />
                <p className="text-white text-sm font-bold">$0.000018</p>
              </a>
              <a
                href="https://telegram.org"
                className="text-yellow-400 text-2xl hover:text-green-400 transition duration-300"
              >
                <FaTelegram />
              </a>
              <a
                href="https://twitter.com"
                className="text-yellow-400 text-2xl hover:text-green-400 transition duration-300"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
