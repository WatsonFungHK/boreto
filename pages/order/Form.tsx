import React, { useEffect, useMemo, useState } from "react";
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
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { string, object, number, array, boolean } from "yup";
import OrderItemForm, {
  generateProductOptions,
} from "components/OrderItemForm";
import AddressPicker from "components/AddressPicker";
import { useItems, getItem, upsertItem } from "lib/swr";
import useDynamicOptions from "hooks/useDynamicOptions";
import { Visibility } from "@mui/icons-material";
import colors from "theme/colors";

export const schema = object().shape({
  isNew: boolean(),
  customerName: string().when("isNew", {
    is: false,
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
  customerId: string().required("required"),
  orderItems: array().of(
    object({
      productId: string().when("isNew", {
        is: false,
        then: (schema) => schema.required("required"),
        otherwise: (schema) => schema.nullable(),
      }),
      product: object({
        value: string().required("required"),
        type: string().required("required"),
        label: string().required("required"),
        price: number().required("required"),
      }),
      quantity: number().required("required"),
      price: number().required("required"),
    })
  ),
  methodId: string().required("required"),
  addressId: string().when("orderItems", {
    is: (orderItems: any[]) => {
      return orderItems.every((item) => item.product.type === "S");
    },
    then: (schema) => schema.required("required"),
    otherwise: (schema) => schema.nullable(),
  }),
});

const defaultValues = {
  isNew: true,
  customerId: undefined,
  orderItems: [{}],
};

export type FormData = ReturnType<typeof schema["cast"]>;
const generateCustomerOptions = (customers: any[]) => {
  return customers.map(({ id, first_name, last_name }) => ({
    value: id,
    label: first_name + " " + last_name,
  }));
};

const generateOrderItems = (orderItems: any[]) => {
  return orderItems.map(({ id, name, quantity, price, productId, type }) => {
    console.log("name: ", name);
    console.log("type: ", type);
    const products = generateProductOptions([{ id, name, price, type }]);
    return {
      productId,
      product: products[0],
      quantity,
      price,
    };
  });
};

const OrderForm = ({}: {}) => {
  const router = useRouter();
  const customerOptions = useDynamicOptions(
    "customer",
    generateCustomerOptions
  );

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const { t } = useTranslation("common", { keyPrefix: "order" });
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

  const { customerId, orderItems } = watch();
  const { data: addresses, error: customerError } = useItems(
    `/api/address/customer/${customerId}`
  );
  const { data: shippingMethods, error: methodError } = useItems(
    `/api/shipping-method/all`
  );

  if (customerError || methodError) {
    toast.error("Error fetching data");
  }

  const [isLoading, setIsLoading] = useState(false);
  const needShipping = !orderItems.every((item) => {
    return item.product?.type === "S";
  });

  useEffect(() => {
    if (!isNew) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(`/api/order/${id}` as string);
          if (item) {
            const orderItems = generateOrderItems(item.orderItems);
            reset({
              isNew,
              ...item,
              customerName:
                item.customer.first_name + " " + item.customer.last_name,
              orderItems,
            });
          }
        } catch (err) {
          toast.error("Error fetching order");
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
      const { isNew, ...payload } = data;
      const response = await upsertItem(`/api/order/${id}` as string, {
        ...payload,
      });
      router.push("/order");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {isNew ? t("create-order") : t("review-order")}
      </Typography>
      <FormProvider {...methods}>
        <Stack spacing={2} direction="column">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("name")}</Typography>
                {isNew && (
                  <FormControl fullWidth error={!!errors.customerId}>
                    <Select
                      value={customerId}
                      onChange={(e) => setValue("customerId", e.target.value)}
                    >
                      {customerOptions.map(({ value, label }) => {
                        return (
                          <MenuItem value={value} key={value}>
                            {t(label)}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
                {!isNew && (
                  <Stack direction={"row"} spacing={1}>
                    <TextField
                      {...register("customerName")}
                      sx={{
                        flexGrow: 1,
                      }}
                      disabled
                    />
                    <IconButton
                      onClick={() => router.push(`/customer/${customerId}`)}
                    >
                      <Visibility />
                    </IconButton>
                  </Stack>
                )}
              </Stack>
            </Grid>
          </Grid>
          {Array.isArray(addresses) && addresses.length > 0 && (
            <Card>
              <CardContent>
                <Grid container>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <Typography>{t("method")}</Typography>
                      <Controller
                        name="methodId"
                        control={control}
                        render={({ field }) => {
                          return (
                            <Select {...field} fullWidth>
                              {shippingMethods?.items.map(({ id, name }) => {
                                return (
                                  <MenuItem value={id} key={id}>
                                    {t(name)}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          );
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid xs={6} />
                </Grid>
                <AddressPicker addresses={addresses} />
              </CardContent>
            </Card>
          )}
          {!(Array.isArray(addresses) && addresses.length > 0) &&
            needShipping && (
              <Typography
                sx={{
                  color: colors.red80,
                }}
              >
                {t("no-address-to-create-shipping")}
              </Typography>
            )}
          <OrderItemForm readOnly={!isNew} defaultExpanded />
          {isNew && (
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              {t(isNew ? "create" : "update")}
            </LoadingButton>
          )}
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default OrderForm;
