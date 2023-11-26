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
  gender: string().optional(),
  email: string().email().optional(),
  status: string(),
  phone_number: string().optional(),
  basicPay: number(),
  employment_type: string().required("required"),
  departmentId: string().optional().nullable(),
  designationId: string().optional().nullable(),
  officeId: string().optional().nullable(),
  birth_date: string().optional().nullable(),
  joined_date: string().optional().nullable(),
  promoted_date: string().optional().nullable(),
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
  status: "A",
  designationId: "",
  employment_type: "FT",
  birth_date: getDateString(),
  joined_date: getDateString(),
  promoted_date: getDateString(),
};

export type FormData = ReturnType<(typeof schema)["cast"]>;

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

const EMPLOYMENT_TYPE = [
  { value: "FT", label: "full-time" },
  { value: "PT", label: "part-time" },
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
  const {
    data: { items: offices } = { items: [] },
    isLoading: isLoadingOffices,
  } = useSWR("/api/office/all", fetcher);

  const {
    data: { items: designations } = { items: [] },
    isLoading: isLoadingDesignation,
  } = useSWR("/api/designation/all", fetcher);

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
            reset(item);
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
      router.push("/company/staff");
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
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("status")}</Typography>
                <FormControl fullWidth error={!!errors.status}>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        {...field}
                        onChange={(e) => setValue("status", e.target.value)}
                      >
                        {STATUSES.map(({ label, value }) => {
                          return (
                            <MenuItem value={value} key={value}>
                              {t(label)}
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
                <Typography>{t("promoted_date")}</Typography>
                <TextField
                  type="date"
                  {...register("promoted_date")}
                  error={!!errors.promoted_date}
                  helperText={errors.promoted_date?.message}
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
                <Typography>{t("designation")}</Typography>
                <FormControl fullWidth error={!!errors.designationId}>
                  <Controller
                    control={control}
                    name="designationId"
                    render={({ field }) => {
                      return (
                        <Select {...field} defaultValue="">
                          {designations.map(({ id, name }) => {
                            return (
                              <MenuItem value={id} key={id}>
                                {name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      );
                    }}
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
                <Typography>{t("employment-type")}</Typography>
                <FormControl fullWidth error={!!errors.employment_type}>
                  <Controller
                    control={control}
                    name="employment_type"
                    render={({ field }) => (
                      <Select {...field}>
                        {EMPLOYMENT_TYPE.map(({ label, value }) => {
                          return (
                            <MenuItem value={value} key={value}>
                              {t(label)}
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
                <Typography>{t("basic-salary")}</Typography>
                <FormControl fullWidth error={!!errors.basicPay}>
                  <TextField type="number" {...register("basicPay")} />
                </FormControl>
              </Stack>
            </Grid>
          </Grid>

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
