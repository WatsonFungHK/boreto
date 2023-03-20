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
import { string, object, array } from "yup";
import Autocomplete from "components/Autocomplete";
import { useItems, getItem, upsertItem } from "lib/swr";

const defaultValues = {
  name: "",
  description: "",
  status: "A",
  products: [],
};

export const schema = object().shape({
  name: string().required("required"),
  description: string().optional(),
  status: string().optional(),
  products: array().of(
    object({
      value: string(),
      label: string(),
    })
  ),
});

export type FormData = ReturnType<typeof schema["cast"]>;

const generateOptions = (items) =>
  items.map(({ id, name }) => ({ value: id, label: name }));

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
  const { data: { total, items: allProducts } = { total: 0, items: [] } } =
    useItems("/api/product/all");

  const { status } = watch();

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(`/api/product-category/${id}`);
          if (item) {
            reset({ ...item, products: generateOptions(item.products) });
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
      const response = await upsertItem(`/api/product-category/${id}`, {
        ...data,
        products: data.products.map(({ value }) => value),
      });
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
          <Autocomplete
            options={generateOptions(allProducts)}
            name="products"
          />
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
