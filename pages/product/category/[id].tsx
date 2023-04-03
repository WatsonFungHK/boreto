import { Tabs, Tab, Stack, Avatar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Form, { generateOptions } from "./Form";
import TimelinePage from "components/TimelinePage";
import colors from "theme/colors";

const Detail = () => {
  const { query } = useRouter();
  const { id } = query;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack gap={2}>
      {id !== "new" && (
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Edit" />
          <Tab label={<Typography>History</Typography>} />
        </Tabs>
      )}
      {value === 0 && <Form />}
      {value === 1 && (
        <TimelinePage
          targetModel={"ProductCategory"}
          targetId={id as string}
          SnapshotForm={({ snapshot }) => {
            console.log("snapshot: ", snapshot);
            return (
              <Form
                snapshot={{
                  ...snapshot,
                  products: generateOptions(snapshot.products),
                }}
              />
            );
          }}
        />
      )}
    </Stack>
  );
};

export default Detail;
