import { Stack } from "@mui/material";
import Chart from "components/Chart";
import OrderAnalytics from "./components/order";
import CustomerAnalytics from "./components/customer";

const Overview = () => {
  return (
    <Stack spacing={3}>
      <OrderAnalytics />
      <CustomerAnalytics />
    </Stack>
  );
};

export default Overview;
