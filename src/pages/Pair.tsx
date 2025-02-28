import { useState } from "react";
import { CustomBarChart } from "../components/charts/CustomBarChart";
import { TransactionsTable } from "../components/data/TransactionsTable";
import { Transaction } from "../types";
import { ArrowUpRight } from "lucide-react";

type TimeFrame = "day" | "week" | "month" | "year";
type GraphDataType = {
  [key: string]: {
    [time in TimeFrame]: Array<{ date: string; value: number }>;
  };
};

const graphData: GraphDataType = {
  Volume: {
    day: Array.from({ length: 24 }, (_, i) => ({
      date: `${i.toString().padStart(2, "0")}:00`,
      value: Math.floor(Math.random() * (400 - 150 + 1)) + 150,
    })),
    week: [
      { date: "18", value: 310 },
      { date: "19", value: 280 },
      { date: "20", value: 250 },
      { date: "21", value: 300 },
      { date: "22", value: 280 },
      { date: "23", value: 260 },
      { date: "24", value: 310 },
    ],
    month: [
      { date: "Week 1", value: 1800 },
      { date: "Week 2", value: 2100 },
      { date: "Week 3", value: 1950 },
      { date: "Week 4", value: 2050 },
    ],
    year: [
      { date: "Jan", value: 8500 },
      { date: "Feb", value: 9200 },
      { date: "Mar", value: 8800 },
      { date: "Apr", value: 9500 },
      { date: "May", value: 10200 },
      { date: "Jun", value: 11000 },
      { date: "Jul", value: 10500 },
      { date: "Aug", value: 11500 },
      { date: "Sep", value: 10800 },
      { date: "Oct", value: 12000 },
      { date: "Nov", value: 12500 },
      { date: "Dec", value: 13000 },
    ],
  },
  Liquidity: {
    day: Array.from({ length: 24 }, (_, i) => ({
      date: `${i.toString().padStart(2, "0")}:00`,
      value: Math.floor(Math.random() * (600 - 300 + 1)) + 300,
    })),
    week: [
      { date: "18", value: 450 },
      { date: "19", value: 420 },
      { date: "20", value: 400 },
      { date: "21", value: 480 },
      { date: "22", value: 460 },
      { date: "23", value: 440 },
      { date: "24", value: 500 },
    ],
    month: [
      { date: "Week 1", value: 3000 },
      { date: "Week 2", value: 3200 },
      { date: "Week 3", value: 3100 },
      { date: "Week 4", value: 3300 },
    ],
    year: [
      { date: "Jan", value: 15000 },
      { date: "Feb", value: 16500 },
      { date: "Mar", value: 15800 },
      { date: "Apr", value: 17000 },
      { date: "May", value: 18500 },
      { date: "Jun", value: 19500 },
      { date: "Jul", value: 20000 },
      { date: "Aug", value: 21000 },
      { date: "Sep", value: 20500 },
      { date: "Oct", value: 22000 },
      { date: "Nov", value: 23000 },
      { date: "Dec", value: 24000 },
    ],
  },
  Fees: {
    day: Array.from({ length: 24 }, (_, i) => ({
      date: `${i.toString().padStart(2, "0")}:00`,
      value: Math.floor(Math.random() * (25 - 5 + 1)) + 5,
    })),
    week: [
      { date: "18", value: 12 },
      { date: "19", value: 10 },
      { date: "20", value: 8 },
      { date: "21", value: 15 },
      { date: "22", value: 13 },
      { date: "23", value: 11 },
      { date: "24", value: 14 },
    ],
    month: [
      { date: "Week 1", value: 80 },
      { date: "Week 2", value: 90 },
      { date: "Week 3", value: 85 },
      { date: "Week 4", value: 95 },
    ],
    year: [
      { date: "Jan", value: 400 },
      { date: "Feb", value: 450 },
      { date: "Mar", value: 420 },
      { date: "Apr", value: 480 },
      { date: "May", value: 500 },
      { date: "Jun", value: 550 },
      { date: "Jul", value: 600 },
      { date: "Aug", value: 650 },
      { date: "Sep", value: 620 },
      { date: "Oct", value: 680 },
      { date: "Nov", value: 700 },
      { date: "Dec", value: 750 },
    ],
  },
  TVL: {
    day: Array.from({ length: 24 }, (_, i) => ({
      date: `${i.toString().padStart(2, "0")}:00`,
      value: Math.floor(Math.random() * (800 - 500 + 1)) + 500,
    })),
    week: [
      { date: "18", value: 680 },
      { date: "19", value: 650 },
      { date: "20", value: 630 },
      { date: "21", value: 700 },
      { date: "22", value: 680 },
      { date: "23", value: 660 },
      { date: "24", value: 720 },
    ],
    month: [
      { date: "Week 1", value: 4500 },
      { date: "Week 2", value: 4800 },
      { date: "Week 3", value: 4700 },
      { date: "Week 4", value: 4900 },
    ],
    year: [
      { date: "Jan", value: 20000 },
      { date: "Feb", value: 22000 },
      { date: "Mar", value: 21000 },
      { date: "Apr", value: 23000 },
      { date: "May", value: 24000 },
      { date: "Jun", value: 25000 },
      { date: "Jul", value: 26000 },
      { date: "Aug", value: 27000 },
      { date: "Sep", value: 26500 },
      { date: "Oct", value: 28000 },
      { date: "Nov", value: 29000 },
      { date: "Dec", value: 30000 },
    ],
  },
};

export const Pair = () => {
  const [activeGraph, setActiveGraph] =
    useState<keyof typeof graphData>("Volume");
  const [activeTableTab, setActiveTableTab] = useState("All");
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>("week");

  // Mock transactions data
  const transactions: Transaction[] = [
    {
      type: "Swap SUI for TRUMP",
      value: "500.00",
      tokens: "(250 SUI, 0.4 TRUMP)",
      account: "0xB8CD_b5t7",
      time: "2 hrs ago",
      category: "Adds",
    },
    {
      type: "Remove Liquidity",
      value: "53.09",
      tokens: "(53.07 SUI, 0.085 TRUMP)",
      account: "0xB8CD_b5t7",
      time: "6 hrs ago",
      category: "Swaps",
    },
  ];

  const filteredTransactions =
    activeTableTab === "All"
      ? transactions
      : transactions.filter((tx) => tx.category === activeTableTab);

  const totalValue =
    graphData[activeGraph][activeTimeFrame]
      ?.reduce((sum, item) => sum + item.value, 0)
      ?.toLocaleString() || "0";

  return (
    <div className="min-h-screen bg-transparent text-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
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
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-custombackgr p-6 rounded-2xl mb-6 border-2 border-yellow-400/30 shadow-lg overflow-scroll">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-teal-400 rounded-full absolute -right-4 shadow-md" />
              <div className="w-10 h-10 bg-yellow-400 rounded-full relative z-10 transform hover:rotate-12 transition-transform" />
            </div>
            <h1 className="text-2xl xs:text-3xl ml-2 sm:text-4xl md:text-2xl lg:text-2xl font-bold font-dela bg-gradient-to-r from-yellow-400 to-teal-400 bg-clip-text text-transparent text-center">
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {/* Positions Column */}
          <div className="space-y-5">
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
            {/* Metric Selection Buttons */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {(Object.keys(graphData) as (keyof typeof graphData)[]).map(
                (graph) => (
                  <button
                    key={graph}
                    onClick={() => setActiveGraph(graph)}
                    className={`px-2 sm:px-3.5 py-1 text-xs sm:text-sm font-poppins transition-all rounded-lg ${
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

            {/* Time Frame Selection + Total Value */}
            <div className=" flex flex-wrap  flex-col sm:flex-row items-start gap-2 sm:gap-2">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {(["day", "week", "month", "year"] as TimeFrame[]).map(
                  (timeFrame) => (
                    <button
                      key={timeFrame}
                      onClick={() => setActiveTimeFrame(timeFrame)}
                      className={`px-2 sm:px-3.5 py-1 text-xs sm:text-sm font-poppins transition-all rounded-lg ${
                        activeTimeFrame === timeFrame
                          ? "bg-blue-400/20 text-blue-300 hover:bg-blue-400/30"
                          : "text-gray-400 hover:bg-blue-800/50 hover:text-gray-300"
                      }`}
                    >
                      {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}
                    </button>
                  )
                )}
              </div>
              <div className="text-lg sm:text-2xl font-dela bg-gradient-to-r from-yellow-400 to-teal-400 bg-clip-text text-transparent">
                ${totalValue}
              </div>
            </div>
          </div>
          <CustomBarChart data={graphData[activeGraph][activeTimeFrame]} />
        </div>

        <TransactionsTable
          transactions={filteredTransactions}
          activeTab={activeTableTab}
          setActiveTab={setActiveTableTab}
        />
      </div>
    </div>
  );
};
