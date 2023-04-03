import React, { useEffect, useState } from "react";
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
import { string, object, array } from "yup";
import AddressForm, { addressSchema } from "components/AddressForm";
import Autocomplete from "components/Autocomplete";
import useStaffOptions from "../hooks/useStaffOptions";

const defaultValues = {
  name: "",
  description: "",
  status: "A",
  type: "",
  addresses: [{}],
  users: [],
};

export const schema = object().shape({
  name: string().required("required"),
  description: string().optional(),
  status: string().optional(),
  type: string().required("required"),
  addresses: array().of(addressSchema),
  users: array(),
});

export type FormData = ReturnType<typeof schema["cast"]>;

const getItem = async (id: string) => {
  const response = await axiosClient.get(`/api/office/${id}`);
  return response.data;
};

const upsertItem = async (id: string, item: FormData) => {
  const response = await axiosClient.post(`/api/office/${id}`, item);
  return response.data;
};

const generateOptions = (items) =>
  items.map(({ id, first_name, last_name, office }) => {
    return {
      value: id,
      label: first_name + " " + last_name + " / " + office?.name,
    };
  });

const ProductCategoryForm = ({}: {}) => {
  const router = useRouter();

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const { t } = useTranslation("common", { keyPrefix: "office" });
  const methods = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const staffOptions = useStaffOptions(generateOptions);

  const { status } = watch();

  useEffect(() => {
    if (!isNew) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(id as string);
          if (item) {
            reset({ ...item, users: generateOptions(item.users) });
          }
        } catch (err) {
          toast.error("error-fetching-item");
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
      const response = await upsertItem(id as string, {
        ...data,
        users: data.users.map(({ value }) => value),
      });
      router.push("/company/office");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t(isNew ? "create" : "update")}</Typography>
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
              multiline
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>Type</Typography>
            <FormControl fullWidth error={!!errors.type}>
              <Controller
                control={methods.control}
                name="type"
                render={({ field }) => (
                  <Select {...field}>
                    <MenuItem value="O">{t("Office")}</MenuItem>
                    <MenuItem value="W">{t("Warehouse")}</MenuItem>
                    <MenuItem value="S">{t("store")}</MenuItem>
                  </Select>
                )}
              />
              {errors.type && (
                <FormHelperText error>{errors.type.message}</FormHelperText>
              )}
            </FormControl>
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
                <FormHelperText error>{errors.status.message}</FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Autocomplete
            options={staffOptions}
            name="users"
            subtitle={t("staff")}
          />
          <AddressForm multiple={false} />
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

export default ProductCategoryForm;
