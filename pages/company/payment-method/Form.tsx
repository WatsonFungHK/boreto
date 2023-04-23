import React, { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Stack,
  Button,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Grid,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { string, object, number } from "yup";
import { useItems, getItem, upsertItem } from "lib/swr";

const defaultValues = {
  name: "",
  description: "",
  cost: 0,
  cost_type: undefined,
  status: "A",
};

export const schema = object().shape({
  name: string().required("required"),
  description: string().optional(),
  costType: string().oneOf(["P", "F"]).required(),
  cost: number().required(),
  status: string().required("required"),
});

export type FormData = ReturnType<(typeof schema)["cast"]>;

const PaymentMethodForm = () => {
  const router = useRouter();

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const { t } = useTranslation("common", { keyPrefix: "paymentMethod" });
  const methods = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(`/api/payment-method/${id}`);
          if (item) {
            reset(item);
          }
        } catch (err) {
          toast.error("Error fetching payment method");
        } finally {
          setIsLoading(false);
        }
      };

      fetchItem();
    }
  }, [isNew]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await upsertItem(`/api/payment-method/${id}`, data);
      router.push("/company/payment-method");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  const costType = methods.watch("costType");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {isNew ? t("create-payment-method") : t("update-payment-method")}
      </Typography>
      <FormProvider {...methods}>
        <Stack spacing={2} direction="column">
          <Stack spacing={1}>
            <Typography>{t("name")}</Typography>
            <TextField
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("description")}</Typography>
            <TextField
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
            />
          </Stack>
          <Stack>
            <Typography>{t("cost-type")}</Typography>
            <FormControl fullWidth>
              <Controller
                control={methods.control}
                name="costType"
                render={({ field }) => (
                  <Select {...field}>
                    <MenuItem value="P">{t("percent")}</MenuItem>
                    <MenuItem value="F">{t("fixed")}</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("cost")}</Typography>
            <TextField
              type="number"
              inputProps={{ min: 0 }}
              {...register("cost")}
              error={!!errors.cost}
              helperText={errors.cost?.message}
              fullWidth
              InputProps={{
                ...(costType === "P" && { endAdornment: "%" }),
              }}
            />
          </Stack>

          {!isNew && (
            <Stack>
              <Typography>{t("status")}</Typography>
              <FormControl fullWidth>
                <Controller
                  control={methods.control}
                  name="status"
                  render={({ field }) => (
                    <Select {...field}>
                      <MenuItem value="A">{t("active")}</MenuItem>
                      <MenuItem value="I">{t("inactive")}</MenuItem>
                      <MenuItem value="D">{t("deleted")}</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Stack>
          )}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {t(isNew ? "create" : "update")}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default PaymentMethodForm;
