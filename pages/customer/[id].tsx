import { Tabs, Tab, Stack, Avatar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Form from "./Form";
import OrderHistory from "./_orderHistory";
import TimelinePage from "components/TimelinePage";
import colors from "theme/colors";

const Customer = () => {
  const { query } = useRouter();
  const { id } = query;
  const [value, setValue] = useState(0);
  const [customer, setCustomer] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack gap={2}>
      {id !== "new" && (
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Edit" />
          <Tab
            label={
              <Stack direction={"row"} gap={1} alignItems="center">
                <Typography>Order History</Typography>
                <Stack
                  sx={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "5px",
                    color: colors.white,
                    fontSize: "12px",
                    backgroundColor: colors.darkBlue70,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {customer?._count?.Order || 0}
                </Stack>
              </Stack>
            }
          />
          <Tab label={<Typography>History</Typography>} />
        </Tabs>
      )}
      {value === 0 && <Form setCustomer={setCustomer} />}
      {value === 1 && <OrderHistory filters={{ customerId: id }} />}
      {value === 2 && (
        <TimelinePage
          targetModel={"Customer"}
          targetId={id as string}
          SnapshotForm={Form}
        />
      )}
    </Stack>
  );
};

export default Customer;
