import { Stack } from "@mui/material";
import Chart from "components/Chart";
import OrderAnalytics from "./components/order";
import CustomerAnalytics from "./components/customer";
import SupplierAnalytics from "./components/supplier";
const Overview = () => {
  return (
    <Stack spacing={3}>
      <OrderAnalytics />
      <CustomerAnalytics />
      <SupplierAnalytics />
    </Stack>
  );
};

export default Overview;
