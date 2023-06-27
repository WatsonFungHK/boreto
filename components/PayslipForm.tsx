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
  Divider,
  FormControl,
} from "@mui/material";
import useDynamicOptions from "hooks/useDynamicOptions";
import useStaffOptions from "hooks/useStaffOptions";
import { useItems } from "lib/swr";
import staff from "pages/company/staff";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import colors from "theme/colors";
import AttendanceTable from "./AttendanceTable";

const generateStaffOptions = (users = []) => {
  if (users.length === 0) {
    return [];
  }
  return users.map(({ id, first_name, last_name }) => {
    return {
      value: id,
      label: first_name + " " + last_name,
    };
  });
};

const PayslipForm = ({ readOnly = false }) => {
  const {
    formState: { errors },
    watch,
    setValue,
    register,
    control,
  } = useFormContext();
  const { t } = useTranslation();
  const customerId = watch("customerId");
  const quotationDate = watch("quotationDate");

  const [id] = useWatch({
    control,
    name: ["StaffId"],
  });
  const { data: selectedStaff } = useItems(`/api/staff/${id}`);

  const { data: { items: staff } = { total: 0, items: [] } } =
    useItems("/api/staff/all");
  return (
    <Stack>
      <Table
        sx={{
          "& .MuiTableCell-root": {
            padding: "8px 16px",
          },
          td: {
            borderBottom: "none",
          },
        }}
      >
        <TableRow>
          <TableCell>
            <Typography>{t("staff")}</Typography>
          </TableCell>
          <TableCell width="300px">
            <Stack spacing={1} flexDirection="row" alignItems="center">
              <FormControl fullWidth error={!!errors.StaffId}>
                <Controller
                  control={control}
                  name="StaffId"
                  render={({ field }) => (
                    <Select {...field}>
                      {staff.map(({ id, first_name, last_name }) => {
                        return (
                          <MenuItem value={id} key={id}>
                            {first_name} {last_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  )}
                />
              </FormControl>
            </Stack>
          </TableCell>
          <TableCell>
            <Typography>Pay Period</Typography>
          </TableCell>
          <TableCell>
            <TextField
              type="month"
              {...register("payPeriod")}
              error={!!errors.payPeriod}
              helperText={errors.payPeriod?.message}
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
            <Typography>{t("designation")}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{selectedStaff?.designation?.name || "N/A"}</Typography>
          </TableCell>
          <TableCell>
            <Typography>Department</Typography>
          </TableCell>
          <TableCell>
            <Typography>{selectedStaff?.department?.name || "N/A"}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>{t("payroll-status")}</Typography>
          </TableCell>
          <TableCell>
            <FormControl fullWidth>
              <Controller
                control={control}
                name="payrollStatus"
                render={({ field }) => (
                  <Select {...field} defaultValue="PENDING">
                    <MenuItem value="PENDING">{t("pending")}</MenuItem>
                    <MenuItem value="PAID">{t("paid")}</MenuItem>
                    <MenuItem value="REJECTED">{t("rejected")}</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </TableCell>
          <TableCell>
            <Typography>{t("settle-date")}</Typography>
          </TableCell>
          <TableCell>
            <TextField
              type="date"
              {...register("settleDate")}
              error={!!errors.settleDate}
              helperText={errors.settleDate?.message}
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
        <TableRow>
          <TableCell>
            <Typography>{t("employment-type")}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{selectedStaff?.employment_type}</Typography>
          </TableCell>
          <TableCell
            sx={{
              backgroundColor: colors.blue70,
              color: colors.white,
            }}
          >
            <Typography>{t("basic-salary")}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{selectedStaff?.basicPay}</Typography>
          </TableCell>
        </TableRow>
      </Table>
      <br />
      <AttendanceTable
        attendance={selectedStaff?.Attendance}
        leave={selectedStaff?.Leave}
      />
    </Stack>
  );
};

export default PayslipForm;
