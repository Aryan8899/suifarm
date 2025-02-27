import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const CustomBarChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
          />
          <YAxis hide={true} />
          <Tooltip
            cursor={{ fill: "rgba(156, 163, 175, 0.1)" }}
            contentStyle={{
              background: "#1E3A8A",
              border: "1px solid #eab308",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#F3F4F6" }}
          />
          <Bar
            dataKey="value"
            fill="#B0E0E6"
            radius={[6, 6, 0, 0]}
            className="hover:fill-blue-200 transition-colors"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
