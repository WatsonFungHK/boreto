import React from "react";
import { Stack, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import colors from "theme/colors";
import { fetcher } from "lib/swr";
import useSWR from "swr";

const GenderPie = () => {
  const COLORS = [colors.red70, colors.blue70, , colors.grey80];

  const { data: { items } = { items: [] }, error } = useSWR(
    {
      url: "/api/analysis/customer/gender",
    },
    fetcher
  );

  return (
    <Stack>
      <Typography>Gender</Typography>
      <ResponsiveContainer width={"100%"} height={300}>
        <PieChart>
          <Pie
            data={items}
            cx={"50%"}
            cy={"50%"}
            labelLine={false}
            outerRadius={100}
            fill={colors.darkBlue70}
            dataKey="count"
          >
            {items.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Stack>
  );
};

export default GenderPie;
