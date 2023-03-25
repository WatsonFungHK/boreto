import useSWR from "swr";
import { fetcher } from "lib/swr";
import { Grid, Stack, Typography } from "@mui/material";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import colors from "theme/colors";
import { useTranslation } from "react-i18next";

interface MostSpentCustomer {
  items: Array<{
    id: string;
    first_name: string;
    last_name: string;
    totalQuantity: number;
  }>;
}
const MostSpentChart = () => {
  const { t } = useTranslation();
  const { data: { items } = { items: [] }, error } = useSWR<MostSpentCustomer>(
    {
      url: "/api/analysis/customer/most-spent",
    },
    fetcher
  );

  const transformedItems = items.map((item) => ({
    ...item,
    name: item.first_name + " " + item.last_name,
  }));

  return (
    <Stack gap={1}>
      <Typography>{t("most-valuable-customer")}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={transformedItems}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="totalAmount"
            name="Total Amount"
            fill={colors.darkBlue70}
          />
        </BarChart>
      </ResponsiveContainer>
    </Stack>
  );
};

export default MostSpentChart;
