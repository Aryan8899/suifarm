import { Transaction } from "../../types";

export const TransactionsTable = ({
  transactions,
  activeTab,
  setActiveTab,
}: {
  transactions: Transaction[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const filteredTransactions =
    activeTab === "All"
      ? transactions
      : transactions.filter((tx) => tx.category === activeTab);

  return (
    <div className="bg-custombackgr rounded-xl overflow-hidden border-2 border-yellow-400/30">
      <div className="p-4 border-b border-yellow-400/30">
        <div className="flex flex-wrap gap-4 font-poppins">
          {["All", "Swaps", "Adds", "Removes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-sm ${
                activeTab === tab
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-300 hover:text-gray-200"
              } transition-colors`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-300 text-sm font-dela bg-blue-950/20">
              <th className="p-4">TRANSACTION VALUE</th>
              <th className="p-4">ACCOUNT</th>
              <th className="p-4">TIME</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, i) => (
              <tr
                key={i}
                className="border-t border-yellow-400/20 hover:bg-blue-950/30 transition-colors group"
              >
                <td className="p-4">
                  <div className="text-sm text-gray-200">{tx.type}</div>
                  <div className="text-lg font-medium group-hover:text-yellow-400 transition-colors">
                    {tx.value}
                  </div>
                  <div className="text-sm text-gray-200">{tx.tokens}</div>
                </td>
                <td className="p-4">
                  <div className="text-green-400 hover:text-green-300 transition-colors cursor-pointer">
                    {tx.account}
                  </div>
                </td>
                <td className="p-4 text-gray-200 text-sm">{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
