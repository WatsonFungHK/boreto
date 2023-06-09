import { Tabs, Tab, Stack, Avatar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Form from "../Form";
import TimelinePage from "components/TimelinePage";
import colors from "theme/colors";
import QRPage from "../../../../components/QRPage";
import { useTranslation } from "react-i18next";

const Detail = () => {
  const { query } = useRouter();
  const { t } = useTranslation();
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
          <Tab label={<Typography>{t("history")}</Typography>} />
          <Tab label={<Typography>{t("print")}</Typography>} />
        </Tabs>
      )}
      {value === 0 && <Form />}
      {value === 1 && (
        <TimelinePage
          targetModel={"Product"}
          targetId={id as string}
          SnapshotForm={Form}
          renderRow={(item, index) => {
            const { data, createdAt } = item;

            if (data.unit.decrement) {
              return (
                <Stack key={item.id} spacing={1} direction="row" sx={{}}>
                  {"Unit decrease "}
                  {data.unit.decrement}
                  {" because of order"}
                </Stack>
              );
            }
            return undefined;
          }}
        />
      )}
      {value === 2 && <QRPage />}
    </Stack>
  );
};

export default Detail;
