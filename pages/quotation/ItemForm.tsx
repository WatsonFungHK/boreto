import {
  Button,
  Grid,
  Icon,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  Accordion,
  Select,
  MenuItem,
  AccordionSummary,
  FormControl,
  Divider,
  FormHelperText,
  InputBase,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Modal,
  ListSubheader,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  useFieldArray,
  useForm,
  useFormContext,
  Controller,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Add, Remove, Delete, ExpandMore } from "@mui/icons-material";
import deepEqual from "deep-equal";
import colors from "theme/colors";
import cuid from "cuid";
import { string, object, date, number, array } from "yup";
import { ContentCopy } from "@mui/icons-material";
import useProductOptions from "hooks/useProductOptions";
import { useRouter } from "next/router";
import { Visibility } from "@mui/icons-material";

export const orderItemSchema = object().shape({
  product: object({
    value: string().required(),
    label: string().required(),
    price: number().required(),
  }).required(),
  quantity: number().integer().positive().required(),
  price: number().required(),
  subtotal: number().required(),
});

export const generateProductOptions = (productOptions) => {
  return productOptions.map((productOption) => {
    return {
      value: productOption.id,
      label: productOption.name,
      price: productOption.price,
      type: productOption.type,
      category: productOption.category,
    };
  });
};

const ItemForm = ({ multiple = true, readOnly = false }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    control,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors: _errors },
  } = useFormContext();
  const { options: productOptions, isLoading } = useProductOptions(
    generateProductOptions
  );
  const orderItems = useFieldArray({
    name: "orderItems",
    control,
  });

  const _orderItems = watch("orderItems");
  const subtotal = _orderItems.reduce((acc, cur) => acc + cur.subtotal, 0);

  useEffect(() => {
    setValue("subtotal", subtotal);
  }, [subtotal, setValue]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Stack
      spacing={2}
      sx={{
        position: "relative",
        marginRight: "50px",
      }}
    >
      <Table
        sx={{
          border: "1px solid black",
          thead: {
            th: {
              padding: "16px",
            },
          },
          "& .MuiTableCell-root": {
            padding: "8px 16px",
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell
              sx={{
                textAlign: "right",
              }}
            >
              Quantity
            </TableCell>
            <TableCell
              sx={{
                textAlign: "right",
              }}
            >
              Price
            </TableCell>
            <TableCell
              sx={{
                textAlign: "right",
              }}
            >
              Subtotal
            </TableCell>
            <TableCell>remark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderItems.fields.map((orderItem, index) => {
            const fieldName = `orderItems.${index}`;
            const item = watch(`${fieldName}`);

            const errors = _errors?.orderItems?.[index] || {};
            return (
              <TableRow
                key={orderItem.id}
                sx={{
                  position: "relative",
                }}
              >
                <TableCell>
                  {!readOnly && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: "4px",
                        right: "-50px",
                        backgroundColor: colors.grey20,
                        "&:hover": {
                          backgroundColor: colors.grey30,
                        },
                      }}
                      onClick={() => orderItems.remove(index)}
                    >
                      <Remove />
                    </IconButton>
                  )}
                  {readOnly && (
                    <InputBase
                      value={item.label || item.product?.label}
                      disabled
                    />
                  )}
                  {!readOnly && (
                    <Controller
                      name={`${fieldName}.product`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors.product}
                          displayEmpty
                          placeholder={t("please-select")}
                          disabled={readOnly}
                          fullWidth
                          onChange={(e) => {
                            field.onChange(e);
                            setValue(`${fieldName}.quantity`, 1);
                            setValue(
                              `${fieldName}.price`,
                              e.target.value.price
                            );
                            setValue(
                              `${fieldName}.subtotal`,
                              e.target.value.price
                            );
                            setValue(
                              `${fieldName}.label`,
                              e.target.value.label
                            );
                          }}
                          sx={{
                            "& .MuiSvgIcon-root": {
                              display: "none",
                            },
                            fieldset: {
                              border: "none",
                            },
                            "& .MuiSelect-select": {
                              padding: 0,
                            },
                          }}
                        >
                          {productOptions.map((productOption) => (
                            <MenuItem
                              key={productOption.value}
                              value={productOption}
                            >
                              {productOption.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <InputBase
                    type="number"
                    {...register(`${fieldName}.quantity`)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setValue(
                        `${fieldName}.subtotal`,
                        Number(e.target.value) * item.price
                      );
                      setValue(`${fieldName}.quantity`, e.target.value);
                    }}
                    sx={{
                      width: "100%",
                      input: {
                        textAlign: "right",
                      },
                    }}
                    disabled={readOnly}
                  />
                </TableCell>
                <TableCell>
                  <InputBase
                    type="number"
                    {...register(`${fieldName}.price`)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setValue(
                        `${fieldName}.subtotal`,
                        Number(e.target.value) * item.quantity
                      );
                      setValue(`${fieldName}.price`, e.target.value);
                    }}
                    sx={{
                      width: "100%",
                      input: {
                        textAlign: "right",
                      },
                    }}
                    disabled={readOnly}
                  />
                </TableCell>
                <TableCell>
                  <InputBase
                    type="number"
                    {...register(`${fieldName}.subtotal`)}
                    sx={{
                      width: "100%",
                      input: {
                        textAlign: "right",
                        ...(errors.subtotal && {
                          border: "1px solid red",
                        }),
                      },
                    }}
                    disabled={readOnly}
                  />
                </TableCell>
                <TableCell>
                  <InputBase
                    {...register(`${fieldName}.remark`)}
                    multiline
                    fullWidth
                    disabled={readOnly}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!readOnly && (
        <IconButton
          onClick={() => orderItems.append({ id: cuid() })}
          sx={{
            position: "absolute",
            bottom: "-20px",
            right: "calc(50% - 20px)",
            backgroundColor: colors.grey20,
            boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.25)",
            "&:hover": {
              backgroundColor: colors.grey30,
            },
          }}
        >
          <Add />
        </IconButton>
      )}
    </Stack>
  );
};

export default ItemForm;
