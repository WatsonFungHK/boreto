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
} from "@mui/material";
import useDynamicOptions from "hooks/useDynamicOptions";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import colors from "theme/colors";

const MoneyForm = () => {
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

  return <Stack>{sum}</Stack>;
};

export default MoneyForm;
