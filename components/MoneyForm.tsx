import {
  Stack,
  Table,
  TableRow,
  TableCell,
  Typography,
  TextField,
  TableBody,
} from "@mui/material";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

const SalaryForm = () => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    register,
  } = useFormContext();
  const { t } = useTranslation();
  const [orderItems, subtotal] = useWatch({
    control,
    name: ["orderItems", "subtotal"],
  });

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography>{t("allowance")}</Typography>
          </TableCell>
          <TableCell>
            <TextField
              sx={{
                border: "none",
              }}
              variant="standard"
              InputProps={{
                endAdornment: "%",
                startAdornment: "-",
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>{t("deduction")}</Typography>
          </TableCell>
          <TableCell>
            <TextField
              sx={{
                border: "none",
              }}
              variant="standard"
              InputProps={{
                endAdornment: "%",
                startAdornment: "-",
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>{t("MPF")}</Typography>
          </TableCell>
          <TableCell>
            <TextField
              sx={{
                border: "none",
              }}
              variant="standard"
              InputProps={{
                endAdornment: "%",
                startAdornment: "-",
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>{t("net-salary")}</Typography>
          </TableCell>
          <TableCell>
            <TextField
              sx={{
                border: "none",
              }}
              variant="standard"
              InputProps={{
                startAdornment: "$",
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default SalaryForm;
