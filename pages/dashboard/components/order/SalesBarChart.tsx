import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import useSWR from "swr";
import { fetcher } from "lib/swr";
import colors from "theme/colors";
import { Stack, Typography } from "@mui/material";

const SalesBarChart = () => {
  const { data: today } = useSWR(
    {
      url: "/api/analysis/order/total-sales",
      query: {
        quickFilter: "today",
      },
    },
    fetcher
  );

  const { data: thisWeek } = useSWR(
    {
      url: "/api/analysis/order/total-sales",
      query: {
        quickFilter: "thisWeek",
      },
    },
    fetcher
  );

  const { data: thisMonth } = useSWR(
    {
      url: "/api/analysis/order/total-sales",
      query: {
        quickFilter: "thisMonth",
      },
    },
    fetcher
  );

  return (
    <Stack gap={1}>
      <Typography>Sales</Typography>
      <BarChart
        width={500}
        height={300}
        data={[today, thisWeek, thisMonth]}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalAmount" fill={colors.darkBlue70} />
      </BarChart>
    </Stack>
  );
};

export default SalesBarChart;
