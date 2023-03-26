import { useRouter } from "next/router";
import TableContainer from "pages/order";

const OrderHistory = ({ filters }) => {
  const router = useRouter();
  return (
    <TableContainer
      filters={filters}
      onRowClick={(row) => {
        router.push(`/order/${row.id}`);
      }}
    />
  );
};

export default OrderHistory;
