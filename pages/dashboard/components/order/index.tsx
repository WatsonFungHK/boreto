import useSWR from "swr";
import { fetcher } from "lib/swr";
import { Grid, Stack, Typography, Card, CardContent } from "@mui/material";

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
import SalesBarChart from "./SalesBarChart";
import BestSoldChart from "./BestProducts";

interface AnalysisData {
  sumOfSales: number;
  bestProducts: {
    id: string;
    name: string;
    totalQuantity: number;
  };
}

const Order = () => {
  const { data, error } = useSWR<AnalysisData>(
    {
      url: "/api/analysis/order/total-sales",
      query: {
        quickFilter: "today",
      },
    },
    fetcher
  );

  return (
    <Stack>
      <Card>
        <CardContent>
          <Typography>Order</Typography>
          <Grid container>
            <Grid item xs={6}>
              <BestSoldChart />
            </Grid>
            <Grid item xs={6}>
              <SalesBarChart />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
export default Order;
