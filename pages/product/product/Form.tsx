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
  Tabs,
  Tab,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { string, object, number, array } from "yup";
import useSWR from "swr";
import ImageForm, { imageSchema } from "components/ImageForm";
import Dropzone from "components/Dropzone";
import supabase from "lib/supabase";
import Attachment from "components/Attachment";
import cuid from "cuid";

const defaultValues = {
  type: "P" as "P" | "S",
  name: "",
  description: "",
  unit: 0,
  price: 0,
  categoryId: undefined,
  supplierId: undefined,
  status: "A",
};

const fetcher = async (url) => {
  const response = await axiosClient.get(url);
  return response.data;
};

export const schema = object().shape({
  type: string().oneOf(["P", "S"]).required("required"),
  name: string().required("required"),
  description: string().optional(),
  unit: number().when("type", {
    is: "P",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.optional(),
  }),
  price: number().positive().required("required"),
  categoryId: string().optional(),
  supplierId: string().when("type", {
    is: "P",
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.optional().nullable(),
  }),
  status: string().required("required"),
  images: array().of(imageSchema),
});

export type FormData = ReturnType<(typeof schema)["cast"]>;

const getItem = async (id: string) => {
  const response = await axiosClient.get(`/api/product/${id}`);
  return response.data;
};

const upsertItem = async (id: string, item: FormData) => {
  const response = await axiosClient.post(`/api/product/${id}`, item);
  return response.data;
};

const ProductForm = ({ snapshot }: { snapshot?: FormData }) => {
  const router = useRouter();

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const {
    isLoading: isLoadingCategories,
    data: { items: productCategories } = { items: [] },
  } = useSWR("/api/product-category/all", fetcher);
  const {
    isLoading: isLoadingSuppliers,
    data: { items: suppliers } = { items: [] },
  } = useSWR("/api/supplier/all", fetcher);

  const { t } = useTranslation("common", { keyPrefix: "product" });
  const methods = useForm<FormData>({
    defaultValues: snapshot || defaultValues,
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const { type, supplierId } = methods.watch();

  useEffect(() => {
    if (!isNew && !snapshot) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(id as string);
          if (item) {
            reset(item);
          }
        } catch (err) {
          toast.error("Error fetching product");
        } finally {
          setIsLoading(false);
        }
      };

      fetchItem();
    }
  }, [isNew]);

  const handleFile = async (file) => {
    const fileId = cuid();
    await supabase.storage.from("attachment").upload(fileId, file);
    await supabase.from("Attachment").insert({
      id: fileId,
      modelId: id,
      modelName: "product",
      name: file.name,
      url: `https://jsxhhyfhmmrlusumnxbq.supabase.co/storage/v1/object/public/product-image/${fileId}`,
    });
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await upsertItem(id as string, data);
      router.push("/product/product");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || isLoadingCategories || isLoadingSuppliers)
    return <div>Loading...</div>;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {isNew ? t("create") : t("edit-product")}
      </Typography>
      <FormProvider {...methods}>
        {isNew && (
          <Controller
            name="type"
            control={methods.control}
            render={({ field: { value } }) => {
              return (
                <Tabs
                  value={value}
                  onChange={() => {
                    methods.setValue("type", value === "P" ? "S" : "P");
                  }}
                >
                  <Tab value={"P"} label={t("product")} />
                  <Tab value={"S"} label={t("service")} />
                </Tabs>
              );
            }}
          />
        )}
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
              multiline
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("price")}</Typography>
            <TextField
              type="number"
              inputProps={{ min: 0 }}
              {...register("price")}
              error={!!errors.price}
              helperText={errors.price?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("category")}</Typography>
            <FormControl fullWidth error={!!errors.categoryId}>
              <Controller
                control={methods.control}
                name="categoryId"
                render={({ field }) => (
                  <Select {...field}>
                    {productCategories.map((category) => (
                      <MenuItem value={category.id} key={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Stack>
          {type === "P" && (
            <>
              <Stack spacing={1}>
                <Typography>{t("unit")}</Typography>
                <TextField
                  type="number"
                  inputProps={{ min: 0 }}
                  {...register("unit")}
                  error={!!errors.unit}
                  helperText={errors.unit?.message}
                  fullWidth
                />
              </Stack>
              <Stack spacing={1}>
                <Typography>{t("supplier")}</Typography>
                <FormControl fullWidth error={!!errors.supplierId}>
                  <Controller
                    control={methods.control}
                    name="supplierId"
                    render={({ field }) => (
                      <Select {...field}>
                        {suppliers.map((item) => (
                          <MenuItem value={item.id} key={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Stack>
            </>
          )}
          <Dropzone handleFile={handleFile} />
          <Attachment modelName="product" modelId={id} />
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            disabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            {t(isNew ? "create" : "update")}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default ProductForm;
