import React, { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
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
import AddressForm from "components/AddressForm";
import useSWR from "swr";

export const schema = object().shape({
  first_name: string().required("required"),
  last_name: string().optional(),
  nick_name: string().optional(),
  gender: string().optional(),
  email: string().email().optional(),
  phone_number: string().optional(),
  departmentId: string().optional(),
  officeId: string().optional(),
  // credit_amount: number().min(0).optional(),
  birth_date: string().optional().nullable(),
  joined_date: string().optional().nullable(),
  addresses: array().of(
    object({
      line_1: string().required(),
      line_2: string().optional(),
      line_3: string().optional(),
      city: string().required(),
      state: string().required(),
      postal_code: string().optional(),
      country: string().required(),
    })
  ),
});

const defaultValues = {
  first_name: "",
  last_name: "",
  gender: "",
  credit_amount: 0,
  birth_date: undefined,
  joined_date: getDateString(),
  departmentId: "",
  officeId: "",
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
  const response = await axiosClient.get(`/api/staff/${id}`);
  return response.data;
};

const upsertItem = async (id: string, item: FormData) => {
  const response = await axiosClient.post(`/api/staff/${id}`, item);
  return response.data;
};

const fetcher = async (url) => {
  const response = await axiosClient.get(url);
  return response.data;
};

const Form = ({}: {}) => {
  const router = useRouter();

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const { t } = useTranslation("common", { keyPrefix: "staff" });
  const {
    data: { items: departments } = { items: [] },
    isLoading: isLoadingDepartments,
  } = useSWR("/api/department/all", fetcher);
  console.log("departments: ", departments);
  const {
    data: { items: offices } = { items: [] },
    isLoading: isLoadingOffices,
  } = useSWR("/api/office/all", fetcher);
  console.log("offices: ", offices);

  const methods = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = methods;
  const { gender, officeId, departmentId } = watch();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(id as string);
          if (item) {
            reset({
              ...item,
            });
          }
        } catch (err) {
          toast.error("Error fetching staff");
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
      const response = await upsertItem(id as string, data);
      router.push("/user");
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
        {isNew ? t("create-staff") : t("review-staff")}
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
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("office")}</Typography>
                <FormControl fullWidth error={!!errors.officeId}>
                  <Controller
                    control={control}
                    name="officeId"
                    render={({ field }) => (
                      <Select
                        value={officeId}
                        onChange={(e) => setValue("officeId", e.target.value)}
                      >
                        {offices.map(({ id, name }) => {
                          return (
                            <MenuItem value={id} key={id}>
                              {t(name)}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("department")}</Typography>
                <FormControl fullWidth error={!!errors.departmentId}>
                  <Controller
                    control={control}
                    name="departmentId"
                    render={({ field }) => (
                      <Select {...field}>
                        {departments.map(({ id, name }) => {
                          console.log("id: ", id);
                          console.log("name: ", name);
                          return (
                            <MenuItem value={id} key={id}>
                              {t(name)}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </Stack>
            </Grid>
          </Grid>
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
          {/* <Stack spacing={1}>
            <Typography>{t("Credit")}</Typography>
            <TextField
              type="number"
              inputProps={{ min: 0 }}
              {...register("credit_amount")}
              error={!!errors.credit_amount}
              helperText={errors.credit_amount?.message}
              fullWidth
            />
          </Stack> */}
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

export default Form;
