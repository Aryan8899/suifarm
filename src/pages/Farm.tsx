import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pool } from "../types";

export const Farm = () => {
  const [activeTab, setActiveTab] = useState("all-pools");
  const [selectedNetwork, setSelectedNetwork] = useState("all-networks");
  const navigate = useNavigate();

  const pools: Pool[] = [
    {
      id: 1,
      token0: "USDT",
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
                activeTab === tab ? "bg-green-500" : "bg-blue-900"
              } hover:bg-green-600 transition-colors`}
              onClick={() => setActiveTab(tab)}
            >
              {tab
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ))}
        </div>

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
                          src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7p8IX51qRehch0W5qAw5dC0Ym3EH3U.png`}
                          alt={pool.token0}
                          className="w-8 h-8 rounded-full border-2 border-yellow-400"
                        />
                        <img
                          src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7p8IX51qRehch0W5qAw5dC0Ym3EH3U.png`}
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
      </div>
    </div>
  );
};
