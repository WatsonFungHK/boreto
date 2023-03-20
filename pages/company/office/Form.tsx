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
import AddressForm from "components/AddressForm";

const defaultValues = {
  name: "",
  description: "",
  status: "A",
  type: "",
  addresses: [{}],
};

export const schema = object().shape({
  name: string().required("required"),
  description: string().optional(),
  status: string().optional(),
  type: string().required("required"),
  addresses: array().of(
    object({
      line_1: string().required("required"),
      line_2: string().optional(),
      line_3: string().optional(),
      city: string().required("required"),
      state: string().required("required"),
      postal_code: string().optional(),
      country: string().required("required"),
    })
  ),
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

  const { status } = watch();

  useEffect(() => {
    if (!isNew) {
      console.log("isNew: ", isNew);
      const fetchItem = async () => {
        console.log("fetchItem");
        try {
          setIsLoading(true);
          const item = await getItem(id as string);
          if (item) {
            reset(item);
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
      const response = await upsertItem(id as string, data);
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
      <Typography variant="h5">Create Office</Typography>
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
