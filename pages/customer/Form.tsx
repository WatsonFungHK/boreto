import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosClient from "lib/axiosClient";
import {
  TextField,
  Stack,
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
import { string, object, date, number, array } from "yup";
import { getDateString } from "utils/date";
import AddressForm, { addressSchema } from "components/AddressForm";

export const schema = object().shape({
  first_name: string().required("required"),
  last_name: string().optional(),
  nick_name: string().optional(),
  gender: string().optional(),
  email: string().email().optional(),
  phone_number: string().optional(),
  credit_amount: number().min(0).optional(),
  birth_date: string().optional().nullable(),
  joined_date: string().optional().nullable(),
  addresses: array().of(addressSchema).min(0),
});

const defaultValues = {
  first_name: "",
  last_name: "",
  gender: "",
  credit_amount: 0,
  birth_date: undefined,
  joined_date: getDateString(),
};

export type FormData = ReturnType<typeof schema["cast"]>;

const GENDERS = [
  { value: "M", label: "male" },
  { value: "F", label: "female" },
  { value: "U", label: "unspecified" },
];

const STATUSES = [
  { value: "A", label: "active" },
  { value: "I", label: "inactive" },
  { value: "D", label: "deleted" },
];

const getItem = async (id: string) => {
  const response = await axiosClient.get(`/api/customer/${id}`);
  return response.data;
};

const upsertItem = async (id: string, item: FormData) => {
  const response = await axiosClient.post(`/api/customer/${id}`, item);
  return response.data;
};

const CustomerForm = ({
  setCustomer,
  snapshot,
}: {
  snapshot?: FormData;
  setCustomer?: Function;
}) => {
  const router = useRouter();

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const { t } = useTranslation("common", { keyPrefix: "customer" });
  const methods = useForm<FormData>({
    defaultValues: snapshot || defaultValues,
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const { gender } = watch();
  console.log("errors: ", errors);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isNew && !snapshot) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(id as string);
          if (item) {
            reset({
              ...item,
              birth_date: getDateString(item.birth_date),
              joined_date: getDateString(item.joined_date),
            });

            setCustomer(item);
          }
        } catch (err) {
          toast.error("Error fetching customer");
        } finally {
          setIsLoading(false);
        }
      };

      fetchItem();
    }
  }, [isNew]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const { _count, ...payload } = data;
      const response = await upsertItem(id as string, payload);
      router.push("/customer");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {isNew ? t("create-customer") : t("review-customer")}
      </Typography>
      <FormProvider {...methods}>
        <Stack spacing={2} direction="column">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("first_name")}</Typography>
                <TextField
                  {...register("first_name")}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("last_name")}</Typography>
                <TextField
                  {...register("last_name")}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("email")}</Typography>
                <TextField
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("phone_number")}</Typography>
                <TextField
                  {...register("phone_number")}
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("birth_date")}</Typography>
                <TextField
                  type="date"
                  {...register("birth_date")}
                  error={!!errors.birth_date}
                  helperText={errors.birth_date?.message}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("joined_date")}</Typography>
                <TextField
                  type="date"
                  {...register("joined_date")}
                  error={!!errors.joined_date}
                  helperText={errors.joined_date?.message}
                  fullWidth
                />
              </Stack>
            </Grid>
          </Grid>
          <Stack spacing={1}>
            <Typography>{t("gender")}</Typography>
            <FormControl fullWidth error={!!errors.gender}>
              <Select
                value={gender}
                onChange={(e) => setValue("gender", e.target.value)}
              >
                {GENDERS.map(({ value, label }) => {
                  return (
                    <MenuItem value={value} key={value}>
                      {t(label)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("nick_name")}</Typography>
            <TextField
              type="text"
              inputProps={{ min: 0 }}
              {...register("nick_name")}
              error={!!errors.nick_name}
              helperText={errors.nick_name?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("Credit")}</Typography>
            <TextField
              type="number"
              inputProps={{ min: 0 }}
              {...register("credit_amount")}
              error={!!errors.credit_amount}
              helperText={errors.credit_amount?.message}
              fullWidth
            />
          </Stack>
          <AddressForm />
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

export default CustomerForm;
