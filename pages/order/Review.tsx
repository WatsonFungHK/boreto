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
import { string, object, date, number, array, boolean } from "yup";
import { getDateString } from "utils/date";
import AddressForm, { addressSchema } from "components/AddressForm";
import OrderItemForm, {
  orderItemSchema,
  generateProductOptions,
} from "components/OrderItemForm";
import AddressPicker from "components/AddressPicker";
import { useItems, getItem, upsertItem } from "lib/swr";
import useDynamicOptions from "hooks/useDynamicOptions";
import { Visibility } from "@mui/icons-material";
import AddressDisplay, { formatAddress } from "components/AddressDisplay";
import { ContentCopy } from "@mui/icons-material";

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
        label: string().required("required"),
        price: number().required("required"),
      }),
      quantity: number().required("required"),
      price: number().required("required"),
    })
  ),
  methodId: string().required("required"),
  addressId: string().required("required"),
  Shipping: array().of(
    object({
      id: string().required(),
      method: object({
        name: string().required("required"),
        provider: string().required("required"),
      }),
      cost: number().required("required"),
      address: addressSchema,
    })
  ),
});

const defaultValues = {
  isNew: true,
  customerId: undefined,
  orderItems: [{}],
  Shipping: [
    {
      address: {},
    },
  ],
};

export type FormData = ReturnType<typeof schema["cast"]>;
const generateCustomerOptions = (customers: any[]) => {
  return customers.map(({ id, first_name, last_name }) => ({
    value: id,
    label: first_name + " " + last_name,
  }));
};

const generateOrderItems = (orderItems: any[]) => {
  return orderItems.map(({ id, name, quantity, price, productId }) => {
    const products = generateProductOptions([{ id, name, price }]);
    return {
      productId,
      product: products[0],
      quantity,
      price,
    };
  });
};

const OrderDetail = ({}: {}) => {
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

  const { customerId, Shipping } = watch();
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

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const item = await getItem(`/api/order/${id}` as string);
        console.log("item: ", item);
        if (item) {
          const orderItems = generateOrderItems(item.orderItems);
          reset({
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
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const { ...payload } = data;
      const response = await upsertItem(`/api/order/${id}` as string, {
        ...payload,
      });
      router.push("/order");
      toast.success(t("updated-success"));
    } catch (err) {
      toast.error(t("updated-error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t("review-order")}</Typography>
      <FormProvider {...methods}>
        <Stack spacing={2} direction="column">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography>{t("customer")}</Typography>
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
              </Stack>
            </Grid>
          </Grid>
          {Shipping && (
            <>
              <Typography variant="h6">{t("shipping")}</Typography>
              <Card>
                <CardContent>
                  {Shipping.map(({ id }, index) => {
                    const fieldName =
                      `Shipping.${index}.method` as `Shipping.${number}.method`;

                    const addressText = formatAddress(Shipping[index]?.address);
                    return (
                      <Grid container key={id} spacing={2}>
                        <Grid item xs={4}>
                          <Stack gap={1}>
                            <Typography>{t("deliver-service")}</Typography>
                            <TextField
                              {...register(`${fieldName}.name`)}
                              disabled
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack gap={1}>
                            <Typography>{t("provider")}</Typography>
                            <TextField
                              {...register(`${fieldName}.provider`)}
                              disabled
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack gap={1}>
                            <Typography>{t("cost")}</Typography>
                            <TextField
                              {...register(
                                `Shipping.${index}.cost` as `Shipping.${number}.cost`
                              )}
                              disabled
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack gap={1}>
                            <Typography>{t("address")}</Typography>
                            <Typography variant="body2">
                              Order snapshot address saves the delivery address
                              during order placement, ensuring accurate delivery
                              information even if the customer's address
                              changes.
                            </Typography>
                            <TextField
                              value={addressText}
                              disabled
                              multiline
                              InputProps={{
                                endAdornment: (
                                  <IconButton
                                    onClick={(event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      navigator.clipboard.writeText(
                                        addressText
                                      );
                                    }}
                                    size="small"
                                  >
                                    <ContentCopy />
                                  </IconButton>
                                ),
                              }}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                    );
                  })}
                </CardContent>
              </Card>
            </>
          )}
          <OrderItemForm readOnly={!isNew} defaultExpanded />
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default OrderDetail;
