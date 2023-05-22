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
import PaymentForm from "components/PaymentForm";
import ItemForm from "components/ItemForm";

const ShippingStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  FAILED_DELIVERY: "FAILED_DELIVERY",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED",
};

const ShippingStatusOptions = [
  { value: ShippingStatus.PENDING, label: "Pending" },
  { value: ShippingStatus.PROCESSING, label: "Processing" },
  { value: ShippingStatus.SHIPPED, label: "Shipped" },
  { value: ShippingStatus.OUT_FOR_DELIVERY, label: "Out for delivery" },
  { value: ShippingStatus.DELIVERED, label: "Delivered" },
  { value: ShippingStatus.FAILED_DELIVERY, label: "Failed delivery" },
  { value: ShippingStatus.RETURNED, label: "Returned" },
  { value: ShippingStatus.CANCELLED, label: "Cancelled" },
];

const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
};

const PaymentStatusOptions = [
  {
    value: PaymentStatus.PENDING,
    label: PaymentStatus.PENDING,
  },
  {
    value: PaymentStatus.COMPLETED,
    label: PaymentStatus.COMPLETED,
  },
];

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
      subtotal: number().required("required"),
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
      status: string().required("required"),
    })
  ),
  Payment: array().of(
    object({
      id: string().required(),
      method: object({
        name: string().required("required"),
      }),
      cost: number().required("required"),
      costType: string().required("required"),
      amount: number().required("required"),
      status: string().required("required"),
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

export type FormData = ReturnType<(typeof schema)["cast"]>;
const generateCustomerOptions = (customers: any[]) => {
  return customers.map(({ id, first_name, last_name }) => ({
    value: id,
    label: first_name + " " + last_name,
  }));
};

const generateOrderItems = (orderItems: any[]) => {
  return orderItems.map(
    ({ id, name, quantity, price, productId, subtotal }) => {
      const products = generateProductOptions([{ id, name, price }]);
      return {
        productId,
        product: products[0],
        quantity,
        price,
        subtotal,
      };
    }
  );
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

  const { customerId, Shipping, Payment } = watch();

  const [isUpdatingShipping, setIsUpdatingShipping] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
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

  const updateShippingStatus = async (index) => {
    try {
      setIsUpdatingShipping(true);
      const shipping = watch(`Shipping.${index}`);
      const { id, status } = shipping;
      const payload = {
        id,
        status,
      };
      await upsertItem(`/api/shipping/${id}`, payload);
      toast.success("Shipping status updated");
    } catch (err) {
      toast.error("Error updating shipping status");
    } finally {
      setIsUpdatingShipping(false);
    }
  };

  const updatePaymentStatus = async (index) => {
    try {
      setIsUpdatingPayment(true);
      const payment = watch(`Payment.${index}`);
      const { id, status } = payment;
      const payload = {
        id,
        status,
      };
      await upsertItem(`/api/payment/${id}`, payload);
      toast.success("payment status updated");
    } catch (err) {
      toast.error("Error updating payment status");
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

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
                  {Shipping.map(({ id, ...restShip }, index) => {
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
                              information even if the customer&apos;s address
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
                        <Grid item xs={6}>
                          <Stack spacing={1}>
                            <Typography>{t("status")}</Typography>
                            <Stack direction={"row"} spacing={2}>
                              <Controller
                                name={
                                  `Shipping.${index}.status` as `Shipping.${number}.status`
                                }
                                control={control}
                                render={({ field: { value } }) => {
                                  return (
                                    <Select
                                      value={value}
                                      onChange={(e) => {
                                        setValue(
                                          `Shipping.${index}.status`,
                                          e.target.value
                                        );
                                      }}
                                      fullWidth
                                    >
                                      {ShippingStatusOptions.map(
                                        ({ value, label }) => {
                                          return (
                                            <MenuItem key={value} value={value}>
                                              {label}
                                            </MenuItem>
                                          );
                                        }
                                      )}
                                    </Select>
                                  );
                                }}
                              />
                              <LoadingButton
                                variant="contained"
                                loading={isUpdatingShipping}
                                onClick={() => updateShippingStatus(index)}
                              >
                                {t("update")}
                              </LoadingButton>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    );
                  })}
                </CardContent>
              </Card>
            </>
          )}

          {Payment && <Typography variant="h6">Payment</Typography>}
          {Payment?.map((payment, index) => {
            return (
              <Card key={payment.id}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <Typography>{payment.method.name}</Typography>
                        <Typography>
                          {payment.cost + payment.costType === "P" && "%"}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <Typography>
                          {`${payment.cost} ${
                            payment.costType === "P" ? "%" : ""
                          }`}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <Typography>{t("status")}</Typography>
                        <Stack direction={"row"} spacing={2}>
                          <Controller
                            name={`Payment.${index}.status`}
                            control={control}
                            render={({ field: { value } }) => {
                              return (
                                <Select
                                  value={value}
                                  onChange={(e) => {
                                    setValue(
                                      `Payment.${index}.status`,
                                      e.target.value
                                    );
                                  }}
                                  fullWidth
                                >
                                  {PaymentStatusOptions.map(
                                    ({ value, label }) => {
                                      return (
                                        <MenuItem key={value} value={value}>
                                          {label}
                                        </MenuItem>
                                      );
                                    }
                                  )}
                                </Select>
                              );
                            }}
                          />
                          <LoadingButton
                            variant="contained"
                            loading={isUpdatingPayment}
                            onClick={() => updatePaymentStatus(index)}
                          >
                            Update
                          </LoadingButton>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
          {/* <OrderItemForm readOnly={!isNew} defaultExpanded /> */}
          <ItemForm readOnly />
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default OrderDetail;
