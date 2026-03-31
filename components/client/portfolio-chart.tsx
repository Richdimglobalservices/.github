"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface Investment {
  id: string;
  plan_name: string;
  amount: number;
}

interface PortfolioChartProps {
  investments: Investment[];
}

const COLORS = ["#8B5A2B", "#A0522D", "#D2691E", "#CD853F", "#DEB887"];

export function ClientPortfolioChart({ investments }: PortfolioChartProps) {
  if (investments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <p>No investments to display</p>
          <p className="text-sm">Start investing to see your portfolio</p>
        </div>
      </div>
    );
  }

  // Group by plan name
  const grouped = investments.reduce((acc: Record<string, number>, inv) => {
    const name = inv.plan_name || "Unknown";
    acc[name] = (acc[name] || 0) + Number(inv.amount);
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
