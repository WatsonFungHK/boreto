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
import ContactForm, { contactSchema } from "components/ContactForm";
import Autocomplete from "components/Autocomplete";
import { useItems, getItem, upsertItem } from "lib/swr";

export const schema = object().shape({
  name: string().required("required"),
  contacts: contactSchema,
  products: array().of(object({ value: string(), label: string() })),
  addresses: addressSchema,
});

const defaultValues = {
  name: "",
  contacts: [{}],
  addresses: [{}],
};

export type FormData = ReturnType<typeof schema["cast"]>;

const generateProductOptions = (products: any[]) => {
  return products.map(({ id, name }) => ({ value: id, label: name }));
};

const SupplierForm = ({}: {}) => {
  const router = useRouter();
  const {
    isLoading: isLoadingProducts,
    data: { total, items: allProducts } = { total: 0, items: [] },
  } = useItems("/api/product/all");

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const { t } = useTranslation("common", { keyPrefix: "supplier" });
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
    formState: { errors },
  } = methods;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(`/api/supplier/${id}` as string);
          if (item) {
            reset({
              ...item,
              products: generateProductOptions(item.products),
            });
          }
        } catch (err) {
          toast.error("Error fetching supplier");
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
      const response = await upsertItem(`/api/supplier/${id}` as string, {
        ...data,
        products: data.products.map(({ value }) => value),
      });
      router.push("/supplier");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProducts || isLoading) return <div>Loading...</div>;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {isNew ? t("create-supplier") : t("review-supplier")}
      </Typography>
      <FormProvider {...methods}>
        <Stack spacing={2} direction="column">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("name")}</Typography>
                <TextField
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              </Stack>
            </Grid>
          </Grid>
          <ContactForm />
          <AddressForm multiple={false} />
          <Autocomplete
            name="products"
            subtitle="products"
            options={generateProductOptions(allProducts)}
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

export default SupplierForm;
