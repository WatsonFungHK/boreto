import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  Stack,
  Select,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";
import { useItems } from "lib/swr";
import { useTranslation } from "react-i18next";
import { object, string, number } from "yup";

export const paymentSchema = object().shape({
  methodId: string().required("required"),
  cost: number().positive().optional().nullable(),
  status: string().required("required"),
});

const PaymentForm = () => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const { t } = useTranslation();
  const { data } = useItems("/api/payment-method/all", {
    pageNumber: 0,
    pageSize: 0,
  });

  const paymentMethodId = watch("payment.methodId");
  const selectedPaymentMethod = data?.items.find(
    (item) => item.id === paymentMethodId
  );

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography>{t("method")}</Typography>
        <Controller
          name="methodId"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              value={value}
              onChange={(event) => {
                setValue("payment.methodId", event.target.value);
              }}
            >
              {data?.items.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Stack>
      <Stack
        spacing={1}
        sx={{
          display: "none",
        }}
      >
        <Typography>{t("cost-type")}</Typography>
        <TextField
          value={selectedPaymentMethod?.costType}
          disabled
          error={!!errors.costType}
          helperText={errors.costType?.message}
          fullWidth
        />
      </Stack>
      <Stack spacing={1}>
        <Typography>{t("cost")}</Typography>
        <TextField
          type="number"
          value={selectedPaymentMethod?.cost}
          disabled
          error={!!errors.cost}
          helperText={errors.cost?.message}
          fullWidth
          InputProps={{
            ...(selectedPaymentMethod?.costType === "P" && {
              endAdornment: "%",
            }),
          }}
        />
      </Stack>
      <Stack spacing={1}>
        <Typography>{t("payment-status")}</Typography>
        <Controller
          name="status"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              value={value}
              onChange={(e) => setValue("payment.status", e.target.value)}
            >
              <MenuItem value={"PENDING"}>{t("Pending")}</MenuItem>
              <MenuItem value={"COMPLETED"}>{t("Completed")}</MenuItem>
            </Select>
          )}
        />
      </Stack>
    </Stack>
  );
};

export default PaymentForm;
