import {
  Stack,
  Table,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Select,
  TableHead,
  TextField,
  InputBase,
  Divider,
  FormControl,
} from "@mui/material";
import { useItems } from "lib/swr";
import staff from "pages/company/staff";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import colors from "theme/colors";

const AttendanceTable = ({ attendance, leave }) => {
  const {
    formState: { errors },
    watch,
    setValue,
    register,
    control,
  } = useFormContext();
  const { t } = useTranslation();

  return (
    <Stack>
      <Typography variant="h6" textAlign="center">
        {t("attendance-record")}
      </Typography>
      <Table
        sx={{
          "& .MuiTableCell-root": {
            padding: "8px 16px",
          },
          td: {
            // borderBottom: "none",
          },
        }}
      >
        <TableRow>
          <TableCell>
            <Typography>{t("date")}</Typography>
          </TableCell>
          <TableCell width="300px">
            <Typography>{t("type")}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{t("timeIn")}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{t("timeOut")}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{t("remark")}</Typography>
          </TableCell>
        </TableRow>

        {attendance?.map((item, index) => (
          <TableRow key={item.id}>
            <TableCell>
              <Typography>{item.date}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{t("attendance")}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{item.timeIn}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{item.timeOut}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{item?.remark || "N/A"}</Typography>
            </TableCell>
          </TableRow>
        ))}
        {leave?.map((item, index) => (
          <TableRow key={item.id}>
            <TableCell>
              <Typography>{item.date}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{item.leaveType}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{item.timeIn}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{item.timeOut}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{item?.remark || "N/A"}</Typography>
            </TableCell>
          </TableRow>
        ))}
      </Table>
      <br />
    </Stack>
  );
};

export default AttendanceTable;
