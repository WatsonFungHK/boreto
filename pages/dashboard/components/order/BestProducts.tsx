import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import useSWR from "swr";
import { fetcher } from "lib/swr";
import colors from "theme/colors";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface BestProducts {
  items: Array<{
    id: string;
    name: string;
    totalQuantity: number;
  }>;
}
const BestSoldChart = () => {
  const { t } = useTranslation();
  const { data: { items } = { items: [] }, error } = useSWR<BestProducts>(
    {
      url: "/api/analysis/order/best-products",
    },
    fetcher
  );

  return (
    <Stack gap={1}>
      <Typography>{t("best products")}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={items}
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
            dataKey="totalQuantity"
            name="Total Quantity"
            fill={colors.darkBlue70}
          />
        </BarChart>
      </ResponsiveContainer>
    </Stack>
  );
};
export default BestSoldChart;
