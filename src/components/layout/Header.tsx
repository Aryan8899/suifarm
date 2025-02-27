import { useState } from "react";
import pic1 from "../../assets/images/pic4.png";
import { ConnectWalletButton } from "./ConnectWalletButton";
import "../../App.css";
import { Wallet } from "lucide-react";
export const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleWalletClick = () => {
    setDropdownVisible(!dropdownVisible);
  };
  return (
    <header className="flex flex-col items-center px-2 py-2 shadow-md relative">
      {/* Logo */}
      <img
        src={pic1}
        alt="trump"
        className="w-[300px] sm:w-[500px] h-[150px] sm:h-[230px] object-contain -mt-6 sm:-mt-10"
      />

      <h2 className="font-dela text-[18px] xs:text-[24px] sm:text-[30px] md:text-[32px] lg:text-[32px] xl:text-[32px] font-normal tracking-normal leading-[1.2em] text-custombackgr text-center -mt-6 sm:-mt-10 md:-mt-12 lg:-mt-16 [text-shadow:2px_2px_0px_white,-2px_2px_0px_white,2px_-2px_0px_white,-2px_-2px_0px_white] whitespace-normal px-4">
        IT'S ALL ABOUT WINNING
      </h2>
      <div className="absolute top-2 right-2">
        <div className="hidden sm:block">
          <ConnectWalletButton />
        </div>
        <div className="sm:hidden relative">
          <button
            className="text-white p-2 rounded-full bg-[#22c55e]"
            onClick={handleWalletClick}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wallet size={20} color="white" />
          </button>

          {dropdownVisible && (
            <div className="absolute right-0 mt-2 z-50">
              <ConnectWalletButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
