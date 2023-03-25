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

const contactTypes = [
  { value: "P", label: "Phone" },
  { value: "E", label: "Email" },
  { value: "F", label: "Fax" },
];

export const contactSchema = array().of(
  object().shape({
    type: string()
      .oneOf(["P", "E", "F"], "Invalid contact type")
      .required("required"),
    value: string()
      .required()
      .test("value", "Invalid contact value", function (value) {
        console.log("value: ", value);
        const { type } = this.parent;

        if (type === "E") {
          // Validate email
          return string().email("Invalid email address").isValidSync(value);
        } else {
          // Validate phone or fax number
          return string()
            .matches(
              /^(\+\d{1,2}\s)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}$/,
              "Invalid phone or fax number"
            )
            .isValidSync(value);
        }
      }),
  })
);

const ContactForm = ({ multiple = true }) => {
  const { t } = useTranslation();
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors: _errors },
  } = useFormContext();
  const contacts = useFieldArray({
    name: "contacts",
    control,
  });

  const formatSummary = (index) => {
    const _contact = getValues(`contacts.${index}`);
    if (_contact.type && _contact.value) {
      return (
        <>
          <Typography variant="subtitle1">{_contact.value}</Typography>
          <IconButton
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              navigator.clipboard.writeText(_contact.value);
            }}
            size="small"
          >
            <ContentCopy />
          </IconButton>
        </>
      );
    }

    return <Typography>{t(`contact ${index + 1}`)}</Typography>;
  };

  return (
    <Stack spacing={2}>
      <Stack justifyContent={"space-between"} direction="row">
        <Typography variant="h6">{t(`contacts`)}</Typography>
        {multiple && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => contacts.append({ id: cuid() })}
          >
            Add
          </Button>
        )}
      </Stack>
      {contacts.fields.map((contact, index) => {
        const fieldName = `contacts.${index}`;
        const errors = _errors?.contacts?.[index] || {};
        return (
          <Stack
            key={contact.id}
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
                <Stack spacing={2}>
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
                      <FormControl fullWidth error={!!errors.type}>
                        <Controller
                          control={control}
                          name="type"
                          render={({ field: { value } }) => (
                            <Select
                              value={value}
                              onChange={(e) => {
                                setValue(`${fieldName}.type`, e.target.value);
                              }}
                            >
                              {contactTypes.map(({ value, label }) => {
                                return (
                                  <MenuItem value={value} key={value}>
                                    {t(label)}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        {errors.type && (
                          <FormHelperText>{errors.type.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                    <Stack spacing={1}>
                      <Typography>{t("content")}</Typography>
                      <TextField
                        {...register(`${fieldName}.value`)}
                        error={!!errors.value}
                        helperText={errors.value?.message}
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
                      <Typography>{t("remark")}</Typography>
                      <TextField
                        multiline
                        {...register(`${fieldName}.remark`)}
                        error={!!errors.remark}
                        helperText={errors.remark?.message}
                        fullWidth
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Accordion>
            {multiple && (
              <IconButton onClick={() => contacts.remove(index)}>
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

export default ContactForm;
