import {
  Button,
  Grid,
  Icon,
  IconButton,
  Stack,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
} from "@mui/material";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Delete, ExpandMore } from "@mui/icons-material";
import deepEqual from "deep-equal";
import colors from "theme/colors";
import cuid from "cuid";
import { array, object, string } from "yup";

export const addressSchema = object({
  line_1: string().required(),
  line_2: string().optional(),
  line_3: string().optional(),
  city: string().required(),
  state: string().optional(),
  postal_code: string().optional(),
  country: string().required(),
});

export type addressType = ReturnType<typeof addressSchema["cast"]>;

const AddressForm = ({ multiple = true }) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    formState: { errors: addressesErrors },
  } = useFormContext();
  const addresses = useFieldArray({
    name: "addresses",
    control,
  });

  return (
    <Stack spacing={2}>
      {multiple && (
        <Stack justifyContent={"space-between"} direction="row">
          <Typography variant="h6">{t(`addresses`)}</Typography>

          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => addresses.append({ id: cuid() })}
          >
            Add
          </Button>
        </Stack>
      )}
      {addresses.fields.map((address, index) => {
        const fieldName = `addresses.${index}`;
        const errors = addressesErrors?.addresses?.[index] || {};
        return (
          <Stack
            key={address.id}
            direction="row"
            justifyContent={"space-between"}
          >
            <Accordion
              defaultExpanded={!multiple}
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
                <Typography variant="h6">
                  {t(`address ${index + 1}`)}
                </Typography>
              </AccordionSummary>
              <Stack spacing={2} sx={{ padding: "0 16px 16px" }}>
                <Stack spacing={2} direction="column">
                  <Stack spacing={1}>
                    <Typography>{t("line_1")}</Typography>
                    <TextField
                      {...register(`${fieldName}.line_1`)}
                      error={!!errors.line_1}
                      helperText={errors.line_1?.message}
                      fullWidth
                    />
                  </Stack>
                  <Stack spacing={1}>
                    <Typography>{t("line_2")}</Typography>
                    <TextField
                      {...register(`${fieldName}.line_2`)}
                      error={!!errors.line_2}
                      helperText={errors.line_2?.message}
                      fullWidth
                    />
                  </Stack>
                  <Stack spacing={1}>
                    <Typography>{t("line_3")}</Typography>
                    <TextField
                      {...register(`${fieldName}.line_3`)}
                      error={!!errors.line_3}
                      helperText={errors.line_3?.message}
                      fullWidth
                    />
                  </Stack>
                  <Stack
                    direction={"row"}
                    spacing={2}
                    justifyContent="space-between"
                    sx={{
                      "> *": {
                        flex: 1,
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography>{t("city")}</Typography>
                      <TextField
                        {...register(`${fieldName}.city`)}
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        fullWidth
                      />
                    </Stack>
                    <Stack spacing={1}>
                      <Typography>{t("state")}</Typography>
                      <TextField
                        {...register(`${fieldName}.state`)}
                        error={!!errors.state}
                        helperText={errors.state?.message}
                        fullWidth
                      />
                    </Stack>
                  </Stack>
                  <Stack
                    direction={"row"}
                    spacing={2}
                    justifyContent="space-between"
                    sx={{
                      "> *": {
                        flex: 1,
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography>{t("country")}</Typography>
                      <TextField
                        {...register(`${fieldName}.country`)}
                        error={!!errors.country}
                        helperText={errors.country?.message}
                        fullWidth
                      />
                    </Stack>

                    <Stack spacing={1}>
                      <Typography>{t("postal_code")}</Typography>
                      <TextField
                        {...register(`${fieldName}.postal_code`)}
                        error={!!errors.postal_code}
                        helperText={errors.postal_code?.message}
                        fullWidth
                      />
                    </Stack>
                  </Stack>
                  <Stack
                    direction={"row"}
                    spacing={2}
                    justifyContent="space-between"
                    sx={{
                      "> *": {
                        flex: 1,
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography>{t("type")}</Typography>
                      <TextField
                        {...register(`${fieldName}.type`)}
                        error={!!errors.type}
                        helperText={errors.type?.message}
                        fullWidth
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Accordion>
            {multiple && (
              <IconButton onClick={() => addresses.remove(index)}>
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

export default AddressForm;
