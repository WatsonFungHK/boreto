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
  TableBody,
} from "@mui/material";
import useDynamicOptions from "hooks/useDynamicOptions";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import colors from "theme/colors";

const MoneyForm = () => {
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
            <Typography>{t("subtotal")}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{subtotal}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>{t("discount")}</Typography>
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
            <Typography>{t("discount-amount")}</Typography>
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
            <Typography>{t("total")}</Typography>
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
      </TableBody>
    </Table>
  );
};

export default MoneyForm;
