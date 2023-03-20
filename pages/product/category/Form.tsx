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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { string, object } from "yup";

const defaultValues = {
  name: "",
  description: "",
  status: "A",
};

export const schema = object().shape({
  name: string().required("required"),
  description: string().optional(),
  status: string().optional(),
});

export type FormData = ReturnType<typeof schema["cast"]>;

const getItem = async (id: string) => {
  const response = await axiosClient.get(`/api/product-category/${id}`);
  return response.data;
};

const upsertItem = async (id: string, item: FormData) => {
  const response = await axiosClient.post(`/api/product-category/${id}`, item);
  return response.data;
};

const ProductCategoryForm = ({}: {}) => {
  const router = useRouter();

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const { t } = useTranslation("common", { keyPrefix: "product-category" });
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
    if (id) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(id as string);
          if (item) {
            reset(item);
          }
        } catch (err) {
          toast.error("Error fetching product category");
        } finally {
          setIsLoading(false);
        }
      };

      fetchItem();
    }
  }, [id]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await upsertItem(id as string, data);
      router.push("/product/category");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
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
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isLoading}
          >
            {t("submit")}
          </LoadingButton>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default ProductCategoryForm;
