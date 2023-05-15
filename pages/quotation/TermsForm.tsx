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
  InputBase,
} from "@mui/material";
import useDynamicOptions from "hooks/useDynamicOptions";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import colors from "theme/colors";

const TermsForm = ({ readOnly }: { readOnly: boolean }) => {
  const {
    formState: { errors },
    watch,
    setValue,
    register,
  } = useFormContext();
  const { t } = useTranslation();
  const orderItems = watch("orderItems");
  const sum = orderItems.reduce((acc, cur) => acc + cur.subtotal, 0);

  useEffect(() => {
    setValue("sum", sum);
  }, [sum]);

  return (
    <Table
      sx={{
        border: "1px solid black",
        thead: {
          th: {
            padding: "16px",
          },
        },
        "& .MuiTableCell-root": {
          padding: "8px 16px",
        },
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell>{t("terms-and-conditions")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <InputBase
              {...register("terms")}
              multiline
              fullWidth
              disabled={readOnly}
              {...(!readOnly && { placeholder: "terms-and-conditions" })}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TermsForm;
