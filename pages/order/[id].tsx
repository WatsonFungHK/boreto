import { useRouter } from "next/router";
import Reivew from "./Review";
import Create from "./Create";
import { useState } from "react";
import TimelinePage from "components/TimelinePage";
import { Tabs, Tab, Stack, Avatar, Typography } from "@mui/material";
import dayjs from "dayjs";

function objectToString(obj) {
  let result = "";

  for (const key in obj) {
    if (result.length > 0) {
      result += ", ";
    }
    result += `${key} to "${obj[key]}"`;
  }

  return result;
}

function OrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (id === "new") {
    return <Create />;
  }

  return (
    <Stack gap={2}>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Review" />
        <Tab label={<Typography>History</Typography>} />
      </Tabs>
      <Stack
        sx={{
          display: value === 0 ? "block" : "none",
        }}
      >
        <Reivew />
      </Stack>
      {value === 1 && (
        <TimelinePage
          targetModel={"Order"}
          targetId={id as string}
          renderRow={(item) => {
            const { user, action, createdAt, data, targetModel } = item;
            return (
              <Stack
                key={item.id}
                spacing={1}
                direction="row"
                sx={{
                  fontSize: "16px",
                }}
              >
                <Typography variant="body1" component={"span"}>
                  {user.first_name + " " + user.last_name}
                </Typography>
                <Typography variant="body1" component={"span"}>
                  {action}
                </Typography>
                {targetModel === "Shipping" && (
                  <>
                    <Typography variant="body1" component={"span"}>
                      {targetModel}
                    </Typography>
                    <Typography variant="body1" component={"span"}>
                      {objectToString(data)}
                    </Typography>
                  </>
                )}
                <Typography variant="body1" component={"span"}>
                  {`on ${dayjs(createdAt).format("YYYY-MM-DD HH:mm")}`}
                </Typography>
              </Stack>
            );
          }}
        />
      )}
    </Stack>
  );
}

export default OrderPage;
