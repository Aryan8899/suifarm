import { Swiper, SwiperSlide } from "swiper/react";
import "../App.css";
import { Autoplay, Pagination } from "swiper/modules";
import { Tweet } from "react-tweet";
import Trump from "../assets/videos/Trump_1_0001-0100_1.webm";
// import { ConnectWalletButton } from "../components/layout/ConnectWalletButton";

export const Dashboard = () => {
  return (
    <div className="min-h-screen text-white space-y-4">
      <div className="rotating-background"></div>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farming & Staking Section */}
        <div className="bg-blue-950 p-6 rounded-xl shadow-lg text-center flex flex-col justify-between border border-yellow-400 h-full relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="text-left px-2 relative z-10">
              <h2 className="text-2xl sm:text-3xl font-dela tracking-wider uppercase text-blue-300 mb-4">
                Farming & Staking
              </h2>

              <div className="space-y-4">
                <div className="bg-blue-900/30 p-4 rounded-lg">
                  <p className="text-lg font-poppins text-white mb-1">
                    VICTORY to Harvest
                  </p>
                  <h3 className="text-3xl sm:text-4xl font-dela text-white">
                    0.000
                  </h3>
                  <p className="text-sm text-gray-400 font-dela">~$0.00</p>
                </div>

                <div className="bg-blue-900/30 p-4 rounded-lg">
                  <p className="text-lg font-poppins text-white mb-1">
                    VICTORY in Wallet
                  </p>
                  <h3 className="text-3xl sm:text-3xl font-dela text-white">
                    0.000
                  </h3>
                  <p className="text-sm text-gray-400 font-dela">~$0.00</p>
                </div>

                <div className="mt-6">
                  <button className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 text-blue-950 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-dela transition-all transform hover:scale-[1.02] shadow-lg shadow-yellow-400/20">
                    Farm
                  </button>{" "}
                </div>
              </div>
            </div>
          </div>
          <div
            className="overflow-hidden absolute inset-0 bg-cover bg-left opacity-40"
            // style={{
            //   backgroundVideo: `url('https://framerusercontent.com/images/PX7OJIh09S4xt8yZNa9dVpjGoE.png')`,
            // }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            >
              <source src={Trump} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Mobile-Specific Background */}
          {/* <div
            className="block sm:hidden absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('https://framerusercontent.com/images/PX7OJIh09S4xt8yZNa9dVpjGoE.png')`,
            }}
          ></div> */}
        </div>

        {/* Announcements Section */}
        <div className="bg-blue-950 overflow-scroll p-6 rounded-xl shadow-lg text-center flex flex-col justify-between relative border border-yellow-400">
          <h2 className="text-xl md:text-3xl lg:text-3xl font-dela tracking-wide text-blue-300 mb-4">
            Announcements
          </h2>
          <iframe
            src="https://dexscreener.com/sui/0x2c2bbe5623c66e9ddf39185d3ab5528493c904b89c415df991aeed73c2427aa9?embed=1&theme=dark&trades=0&info=0"
            title="Dex Screener Chart"
            className="w-full h-[400px] rounded-md border border-gray-700"
          />
        </div>

        {/* Stats Section */}
        {/* AtroVICTORY Stats */}
        <div className="bg-blue-950 p-6 rounded-lg shadow-lg border border-yellow-400 overflow-scroll">
          <h2 className="text-2xl font-dela mb-4 text-blue-300">
            Sui Trump Farm Stats
          </h2>
          <ul className="space-y-2 mt-12 min-w-[340px]">
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
        <div className="bg-blue-950 p-4 sm:p-6 rounded-lg shadow-lg border border-yellow-400 overflow-hidden">
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
                <Tweet id="1868101777171923259" />
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
