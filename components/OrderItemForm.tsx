import {
  Button,
  Grid,
  Icon,
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
} from "@mui/material";
import {
  useFieldArray,
  useForm,
  useFormContext,
  Controller,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Delete, ExpandMore } from "@mui/icons-material";
import deepEqual from "deep-equal";
import colors from "theme/colors";
import cuid from "cuid";
import { string, object, date, number, array } from "yup";
import { ContentCopy } from "@mui/icons-material";
import useProductOptions from "hooks/useProductOptions";
import { useRouter } from "next/router";
import { Visibility } from "@mui/icons-material";

const orderItemTypes = [
  { value: "P", label: "Phone" },
  { value: "E", label: "Email" },
  { value: "F", label: "Fax" },
];

export const orderItemSchema = array().of(
  object().shape({
    product: object({
      value: string().required(),
      label: string().required(),
      price: number().required(),
    }).required(),
    quantity: number().integer().positive().required(),
    price: number().required(),
  })
);

export const generateProductOptions = (productOptions) => {
  return productOptions.map((productOption) => {
    return {
      value: productOption.id,
      label: productOption.name,
      price: productOption.price,
    };
  });
};

const OrderItemForm = ({
  multiple = true,
  readOnly = false,
  defaultExpanded,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors: _errors },
  } = useFormContext();
  const productOptions = useProductOptions(generateProductOptions);
  const orderItems = useFieldArray({
    name: "orderItems",
    control,
  });

  const formatSummary = (index) => {
    const _orderItem = getValues(`orderItems.${index}`);
    console.log("_orderItem: ", _orderItem);
    if (_orderItem.product?.label) {
      return (
        <>
          <Typography variant="subtitle1">
            {_orderItem.product.label}
          </Typography>
          {_orderItem.quantity && (
            <>
              <Typography
                variant="subtitle1"
                sx={{
                  color: colors.grey90,
                }}
              >
                x {_orderItem.quantity}
              </Typography>
              <Typography variant="subtitle1">
                = {_orderItem.quantity * _orderItem.product.price}
              </Typography>
            </>
          )}
        </>
      );
    }

    return <Typography>{t(`orderItem ${index + 1}`)}</Typography>;
  };

  return (
    <Stack spacing={2}>
      <Stack justifyContent={"space-between"} direction="row">
        <Typography variant="h6">{t(`orderItems`)}</Typography>
        {multiple && !readOnly && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => orderItems.append({ id: cuid() })}
          >
            Add
          </Button>
        )}
      </Stack>
      {orderItems.fields.map((orderItem, index) => {
        const fieldName = `orderItems.${index}`;
        const item = getValues(`${fieldName}`);
        console.log("item: ", item);

        const errors = _errors?.orderItems?.[index] || {};
        return (
          <Stack
            key={orderItem.id}
            direction="row"
            justifyContent={"space-between"}
          >
            <Accordion
              defaultExpanded={defaultExpanded}
              sx={{
                width: "100%",
                ...(!deepEqual(errors, {}) && {
                  border: "1px solid",
                  borderColor: `${colors.red70} !important`,
                }),
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Stack
                  divider={<Divider orientation="vertical" flexItem />}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  {formatSummary(index)}
                </Stack>
              </AccordionSummary>
              <Stack spacing={2} sx={{ padding: "0 16px 16px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <Typography>{t("product")}</Typography>
                      <FormControl fullWidth error={!!errors.product}>
                        <Controller
                          control={control}
                          name="product"
                          render={() =>
                            readOnly ? (
                              <Stack direction={"row"} spacing={1}>
                                <TextField
                                  value={item.product?.label}
                                  sx={{
                                    flexGrow: 1,
                                  }}
                                  disabled
                                />
                                <IconButton
                                  onClick={() =>
                                    router.push(
                                      `/product/product/${item.productId}`
                                    )
                                  }
                                >
                                  <Visibility />
                                </IconButton>
                              </Stack>
                            ) : (
                              <Select
                                value={item.product}
                                onChange={(e) => {
                                  setValue(
                                    `${fieldName}.product`,
                                    e.target.value
                                  );
                                  setValue(
                                    `${fieldName}.price`,
                                    e.target.value.price
                                  );
                                }}
                                disabled={readOnly}
                              >
                                {productOptions.map((option) => {
                                  return (
                                    <MenuItem value={option} key={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            )
                          }
                        />
                        {errors.product && (
                          <FormHelperText>
                            {errors.product.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={1}>
                      <Typography>{t("quantity")}</Typography>
                      <TextField
                        type="number"
                        {...register(`${fieldName}.quantity`)}
                        error={!!errors.quantity}
                        helperText={errors.quantity?.message}
                        fullWidth
                        disabled={readOnly}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={1}>
                      <Typography>{t("price")}</Typography>
                      <TextField
                        {...register(`${fieldName}.price`)}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        fullWidth
                        disabled={readOnly}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Accordion>
            {multiple && !readOnly && (
              <IconButton onClick={() => orderItems.remove(index)}>
                <Delete
                  sx={{
                    color: "red",
                  }}
                />
              </IconButton>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default OrderItemForm;
