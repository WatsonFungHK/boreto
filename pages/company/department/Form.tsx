import React, { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosClient from "lib/axiosClient";
import {
  TextField,
  Stack,
  Button,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Grid,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { string, object, date, number, array } from "yup";
import useSWR from "swr";
import Autocomplete from "components/Autocomplete";
import useStaffOptions from "../hooks/useStaffOptions";

// Define the schema for the form
export const schema = object().shape({
  name: string().required("required"),
  description: string().optional(),
  status: string().default("A").oneOf(["A", "I", "D"]), // 'A' = Active, 'I' = Inactive, 'D' = Deleted
  users: array(),
});

// Define the default form values
const defaultValues = {
  name: "",
  description: "",
  status: "A",
  users: [],
};

// Define the possible values for the 'status' field
const STATUS_OPTIONS = [
  { value: "A", label: "Active" },
  { value: "I", label: "Inactive" },
  { value: "D", label: "Deleted" },
];

export type FormData = ReturnType<typeof schema["cast"]>;

// Define the API endpoints for fetching and upserting data
const getItem = async (id: string) => {
  const response = await axiosClient.get(`/api/department/${id}`);
  return response.data;
};

const upsertItem = async (id: string, item: FormData) => {
  const response = await axiosClient.post(`/api/department/${id}`, item);
  return response.data;
};

const generateOptions = (items) =>
  items.map(({ id, first_name, last_name, department }) => {
    return {
      value: id,
      label: first_name + " " + last_name + " / " + department?.name,
    };
  });

// Define the form component
const DepartmentForm = () => {
  const router = useRouter();

  // Determine whether the form is being used for a new item or an existing one
  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  // Set up the form validation and submission
  const { t } = useTranslation("common", { keyPrefix: "department" });
  const staffOptions = useStaffOptions(generateOptions);

  const methods = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = methods;
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the data for an existing item, if applicable
  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(id as string);
          if (item) {
            reset({ ...item, users: generateOptions(item.users) });
          }
        } catch (err) {
          toast.error("Error fetching department");
        } finally {
          setIsLoading(false);
        }
      };

      fetchItem();
    }
  }, [id]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await upsertItem(id as string, {
        ...data,
        users: data.users.map(({ value }) => value),
      });
      router.push("/company/department");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Department Form</Typography>
      <FormProvider {...methods}>
        <Stack spacing={2} direction="column">
          <Stack spacing={1}>
            <Typography>Name</Typography>
            <TextField
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>Description</Typography>
            <TextField
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>Status</Typography>
            <FormControl fullWidth error={!!errors.status}>
              <Controller
                control={methods.control}
                name="status"
                render={({ field }) => (
                  <Select {...field}>
                    <MenuItem value="A">Active</MenuItem>
                    <MenuItem value="I">Inactive</MenuItem>
                    <MenuItem value="D">Deleted</MenuItem>
                  </Select>
                )}
              />
              {errors.status && (
                <FormHelperText>{errors.status.message}</FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Autocomplete
            options={staffOptions}
            name="users"
            subtitle={t("staff")}
          />
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

export default DepartmentForm;
