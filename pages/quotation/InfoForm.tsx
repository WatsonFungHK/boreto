import {
  Stack,
  Table,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Select,
  TableHead,
  TextField,
  InputBase,
} from "@mui/material";
import useDynamicOptions from "hooks/useDynamicOptions";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import colors from "theme/colors";

const generateCustomerOptions = (customers: any[]) => {
  return customers.map(({ id, first_name, last_name }) => ({
    value: id,
    label: first_name + " " + last_name,
  }));
};

const InfoForm = ({ readOnly = false }) => {
  const {
    formState: { errors },
    watch,
    setValue,
    register,
  } = useFormContext();
  const { t } = useTranslation();
  const customerId = watch("customerId");
  const customerOptions = useDynamicOptions(
    "customer",
    generateCustomerOptions
  );

  return (
    <Stack>
      <Table
        sx={{
          "& .MuiTableCell-root": {
            padding: "8px 16px 8px 0",
          },
          td: {
            borderBottom: "none",
          },
        }}
      >
        <TableRow>
          <TableCell>
            <Typography>Customer</Typography>
          </TableCell>
          <TableCell>
            {!readOnly && <InputBase />}
            {readOnly && (
              <Select
                value={customerId}
                onChange={(e) => setValue("customerId", e.target.value)}
                sx={{
                  "& .MuiSvgIcon-root": {
                    display: "none",
                  },
                  fieldset: {
                    borderRadius: "0px",
                    border: "none",
                    borderBottom: "1px solid black",
                  },
                  "& .MuiSelect-select": {
                    padding: "4px 8px",
                  },
                }}
                fullWidth
              >
                {customerOptions.map(({ value, label }) => {
                  return (
                    <MenuItem value={value} key={value}>
                      {t(label)}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
          </TableCell>
          <TableCell>
            <Typography>Quotation Date</Typography>
          </TableCell>
          <TableCell>
            <TextField
              type="date"
              {...register("quotationDate")}
              error={!!errors.quotationDate}
              helperText={errors.quotationDate?.message}
              fullWidth
              InputProps={{
                endAdornment: null,
              }}
              disabled={readOnly}
              sx={{
                input: {
                  padding: "4px 8px",
                  border: "none",
                },
              }}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Typography>Qoutation Id</Typography>
          </TableCell>
          <TableCell>
            <InputBase
              {...register("externalId")}
              sx={{
                input: {
                  borderBottom: "1px solid black",
                },
              }}
              fullWidth
              disabled={readOnly}
            />
          </TableCell>
          <TableCell>
            <Typography>Effective Until</Typography>
          </TableCell>
          <TableCell>
            <TextField
              type="date"
              {...register("effectiveDate")}
              error={!!errors.quotationDate}
              helperText={errors.quotationDate?.message}
              fullWidth
              InputProps={{
                endAdornment: null,
              }}
              sx={{
                input: {
                  padding: "4px 8px",
                  border: "none",
                },
              }}
              disabled={readOnly}
            />
          </TableCell>
        </TableRow>
      </Table>
    </Stack>
  );
};

export default InfoForm;
