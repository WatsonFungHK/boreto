import useSWR from "swr";
import { fetcher } from "lib/swr";
import { Grid, Stack, Typography, Card, CardContent } from "@mui/material";

import React from "react";
import SalesBarChart from "./SalesBarChart";
import BestSoldChart from "./BestProducts";
import BestCategoryChart from "./BestCategories";

interface AnalysisData {
  sumOfSales: number;
  bestProducts: {
    id: string;
    name: string;
    totalQuantity: number;
  };
}

const Order = () => {
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
              <BestCategoryChart />
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
