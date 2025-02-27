import { useState } from "react";
import { CustomBarChart } from "../components/charts/CustomBarChart";
import { TransactionsTable } from "../components/data/TransactionsTable";
// import { graphData } from "../utils/helpers";
import { Transaction } from "../types";
import { ArrowUpRight } from "lucide-react";

type GraphDataType = {
  [key: string]: Array<{ date: string; value: number }>;
};

const graphData: GraphDataType = {
  Volume: [
    { date: "18", value: 310 },
    { date: "19", value: 280 },
    { date: "20", value: 250 },
    { date: "21", value: 300 },
    { date: "22", value: 280 },
    { date: "23", value: 260 },
    { date: "24", value: 310 },
  ],
  Liquidity: [
    { date: "18", value: 450 },
    { date: "19", value: 420 },
    { date: "20", value: 400 },
    { date: "21", value: 480 },
    { date: "22", value: 460 },
    { date: "23", value: 440 },
    { date: "24", value: 500 },
  ],
  Fees: [
    { date: "18", value: 12 },
    { date: "19", value: 10 },
    { date: "20", value: 8 },
    { date: "21", value: 15 },
    { date: "22", value: 13 },
    { date: "23", value: 11 },
    { date: "24", value: 14 },
  ],
  TVL: [
    { date: "18", value: 680 },
    { date: "19", value: 650 },
    { date: "20", value: 630 },
    { date: "21", value: 700 },
    { date: "22", value: 680 },
    { date: "23", value: 660 },
    { date: "24", value: 720 },
  ],
};

export const Pair = () => {
  const [activeGraph, setActiveGraph] =
    useState<keyof typeof graphData>("Volume");
  const [activeTableTab, setActiveTableTab] = useState("All");

  // Mock transactions data - should be moved to helpers in real implementation
  const transactions: Transaction[] = [
    {
      type: "Swap SUI for TRUMP",
      value: "$3.97",
      tokens: "(9.97 SUI, 0.016 TRUMP)",
      account: "0xSFE5_3698",
      time: "recently",
      category: "Swaps",
    },
    {
      type: "Add Liquidity",
      value: "$500.00",
      tokens: "(250 SUI, 0.4 TRUMP)",
      account: "0xB8CD_b5t7",
      time: "2 hrs ago",
      category: "Adds",
    },
    {
      type: "Remove Liquidity",
      value: "$1.19K",
      tokens: "(1,189.79 SUI, 1.92 TRUMP)",
      account: "0xe6c6_f647",
      time: "4 hrs ago",
      category: "Removes",
    },
    {
      type: "Swap TRUMP for SUI",
      value: "$53.09",
      tokens: "(53.07 SUI, 0.085 TRUMP)",
      account: "0xB8CD_b5t7",
      time: "6 hrs ago",
      category: "Swaps",
    },
    // Add other transactions...
  ];

  const filteredTransactions =
    activeTableTab === "All"
      ? transactions
      : transactions.filter((tx) => tx.category === activeTableTab);

  const totalValue =
    graphData[activeGraph]
      ?.reduce((sum, item) => sum + item.value, 0)
      ?.toLocaleString() || "0";

  return (
    <div className="min-h-screen bg-transparent text-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <nav className="mb-4">
          <div className="flex items-center gap-2 text-custombackgr font-poppins text-sm md:text-base">
            <span className="hover:text-yellow-300 text-custombackgr transition-colors cursor-pointer">
              Farms
            </span>
            <span>›</span>
            <span className="text-custombackgr hover:text-yellow-300">
              SUI / TRUMP
            </span>
          </div>
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-4 bg-custombackgr  p-6 rounded-2xl mb-6 border-2 border-yellow-400/30 shadow-lg overflow-scroll">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-teal-400 rounded-full absolute -right-2 shadow-md" />
              <div className="w-10 h-10 bg-yellow-400 rounded-full relative z-10 transform hover:rotate-12 transition-transform" />
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-2xl lg:text-2xl font-bold font-dela bg-gradient-to-r from-yellow-400 to-teal-400 bg-clip-text text-transparent text-center">
              SUI / TRUMP
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 backdrop-blur-sm bg-blue-900/30 px-3 py-1.5 rounded-full">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-sm font-poppins">SUI Chain</span>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-green-400 font-poppins">
                <ArrowUpRight size={18} className="flex-shrink-0" />
                <span className="text-lg font-medium">56.68%</span>
              </div>
              <span className="text-xs text-gray-400">Current APR</span>
            </div>
          </div>
        </div>
        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {/* Positions Column */}
          <div className="space-y-5">
            {/* Overview Card */}
            <div className="bg-custombackgr p-5 rounded-xl border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-colors">
              <h2 className="text-blue-300 mb-4 text-sm font-dela uppercase tracking-wider">
                OVERVIEW
              </h2>
              <div className="space-y-4 font-poppins">
                {[
                  ["My Liquidity Value", "$0.00"],
                  ["My Total APR", "0.00%"],
                  [
                    "Earning",
                    <span key="earning" className="flex items-center gap-2">
                      LP Fee{" "}
                      <span className="text-yellow-400 animate-pulse">●</span>
                    </span>,
                  ],
                ].map(([label, value], index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-blue-600/20 rounded-lg hover:bg-blue-950/50 transition-colors"
                  >
                    <span className="text-gray-400 text-sm">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-custombackgr p-5 rounded-xl border-2 border-yellow-400/30 group hover:border-yellow-400/50 transition-colors">
              <h2 className="text-blue-300 mb-2 text-sm font-dela uppercase tracking-wider">
                TOTAL FARMING EARNING
              </h2>
              <div className="text-3xl font-bold font-dela mb-1 group-hover:text-blue-300 transition-colors">
                $0
              </div>
              <div className="text-sm text-gray-400 font-poppins">
                0.00 CAKE
              </div>
            </div>
            {/* Add Liquidity Button */}
            <button className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 text-blue-950 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-dela transition-all transform hover:scale-[1.02] shadow-lg shadow-yellow-400/20">
              Add Liquidity
            </button>
          </div>

          {/* Pair Info Column */}
          <div className="bg-custombackgr p-5 rounded-xl border-2 border-yellow-400/30 hover:border-yellow-400/50 transition-colors">
            <h2 className="text-blue-300 mb-3 text-sm font-dela uppercase tracking-wider">
              TOTAL TOKENS LOCKED (TVL)
            </h2>
            <div className="flex justify-between items-baseline mb-5 font-poppins">
              <span className="text-3xl font-bold font-dela bg-gradient-to-r from-yellow-400 to-teal-400 bg-clip-text text-transparent">
                $6.84M
              </span>
              <span className="flex items-center gap-1.5 text-green-400 text-sm">
                <ArrowUpRight size={14} /> 1.72%
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { color: "teal-400", label: "SUI", value: "1.78M" },
                { color: "yellow-400", label: "TRUMP", value: "8,168.61" },
              ].map((token, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-blue-600/20 rounded-lg hover:bg-blue-950/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 bg-${token.color} rounded-full shadow`}
                    />
                    <span className="text-sm">{token.label}</span>
                  </div>
                  <span className="font-medium">{token.value}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 font-poppins">
              {[
                ["VOLUME 24H", "$95.86M", "↓ 37.92%", "red-400"],
                ["FEE 24H", "$9.59K", "", ""],
              ].map(([label, value, change, color], index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-200 text-sm">{label}</span>
                  <div className="text-right">
                    <div className="font-medium">{value}</div>
                    {change && (
                      <div className={`text-${color} text-xs`}>{change}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-custombackgr p-5 rounded-xl border-2 border-yellow-400/30 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(graphData) as (keyof typeof graphData)[]).map(
                (graph) => (
                  <button
                    key={graph}
                    onClick={() => setActiveGraph(graph)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-poppins transition-all ${
                      activeGraph === graph
                        ? "bg-blue-400/20 text-blue-300 hover:bg-blue-400/30"
                        : "text-gray-400 hover:bg-blue-800/50 hover:text-gray-300"
                    }`}
                  >
                    {graph}
                  </button>
                )
              )}
            </div>
            <div className="text-2xl font-dela bg-gradient-to-r from-yellow-400 to-teal-400 bg-clip-text text-transparent">
              ${totalValue}
            </div>
          </div>
          <CustomBarChart data={graphData[activeGraph]} />
        </div>

        {/* Transactions Table */}
        <TransactionsTable
          transactions={filteredTransactions}
          activeTab={activeTableTab}
          setActiveTab={setActiveTableTab}
        />
      </div>
    </div>
  );
};
