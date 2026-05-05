import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Define CustomTooltip OUTSIDE component to avoid re-creation error
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-red-500/30 rounded-xl p-3 shadow-xl">
        <p className="text-xs text-red-400 mb-1">{label}</p>
        {payload.map((p, index) => (
          <p key={index} className="text-sm text-white">
            {p.name}:{" "}
            <span className="font-semibold text-red-400">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Charts = ({ analytics }) => {
  // Transform analytics data for charts
  const growthData = useMemo(() => {
    if (analytics?.userGrowth && analytics?.userGrowth.length) {
      return analytics.userGrowth.map((item, index) => ({
        month: `Month ${index + 1}`,
        users: item.count || 0,
        votes: analytics.voteDistribution?.[index]?.totalVotes || 0,
      }));
    }
    // Fallback data
    return [
      { month: "Jan", users: 65, votes: 45 },
      { month: "Feb", users: 78, votes: 62 },
      { month: "Mar", users: 90, votes: 78 },
      { month: "Apr", users: 105, votes: 95 },
      { month: "May", users: 125, votes: 112 },
      { month: "Jun", users: 150, votes: 138 },
    ];
  }, [analytics]);

  const categoryData = useMemo(() => {
    if (analytics?.pollsByCategory && analytics.pollsByCategory.length) {
      const colors = ["#ef4444", "#f97316", "#dc2626", "#b91c1c", "#7f1d1d"];
      return analytics.pollsByCategory.map((item, index) => ({
        name: item._id?.charAt(0).toUpperCase() + item._id?.slice(1) || "Other",
        value: item.count || 0,
        color: colors[index % colors.length],
      }));
    }
    // Fallback data
    return [
      { name: "Technology", value: 35, color: "#ef4444" },
      { name: "Sports", value: 25, color: "#f97316" },
      { name: "Politics", value: 20, color: "#dc2626" },
      { name: "Entertainment", value: 12, color: "#b91c1c" },
      { name: "Other", value: 8, color: "#7f1d1d" },
    ];
  }, [analytics]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-black/40 rounded-xl p-4">
        <h3 className="text-sm font-medium text-red-400 mb-4">
          User & Vote Growth
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} />
            <YAxis stroke="#ffffff40" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#ffffff60" }} />
            <Bar dataKey="users" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="votes" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-black/40 rounded-xl p-4">
        <h3 className="text-sm font-medium text-red-400 mb-4">
          Polls by Category
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
