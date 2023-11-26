import {
  Stack,
  Table,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Select,
  TextField,
  FormControl,
  TableBody,
} from "@mui/material";
import useDynamicOptions from "hooks/useDynamicOptions";
import useStaffOptions from "hooks/useStaffOptions";
import { useItems } from "lib/swr";
import staff from "pages/company/staff";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import colors from "theme/colors";
import AttendanceTable from "./AttendanceTable";

const PayslipForm = ({ readOnly = false, methods }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = methods;
  const { t } = useTranslation();

  const [id] = useWatch({
    control,
    name: ["staffId"],
  });
  const [payPeriod] = useWatch({
    control,
    name: ["payPeriod"],
  });
  const { data: selectedStaff } = useItems(
    `/api/staff/${id}?payPeriod=${payPeriod}`
  );

  const { data: { items: staff } = { total: 0, items: [] } } =
    useItems("/api/staff/all");
  const basicPay = readOnly ? getValues("basicPay") : selectedStaff?.basicPay;
  const deduction = watch("deduction");
  const allowance = watch("allowance");
  const maxMPF =
    Math.round(
      (basicPay - parseInt(deduction) + parseInt(allowance)) * 0.05 * 100
    ) / 100;
  const mpfAmount = maxMPF >= 1500 ? 1500 : maxMPF;
  const netSalaryAmount =
    basicPay - parseInt(deduction) + parseInt(allowance) - mpfAmount;

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
              <FormControl fullWidth error={!!errors.staffId}>
                {!readOnly ? (
                  <Controller
                    control={methods.control}
                    name="staffId"
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
                ) : (
                  <Typography>
                    {selectedStaff?.first_name + selectedStaff?.last_name}
                  </Typography>
                )}
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
            <Typography>{basicPay}</Typography>
          </TableCell>
        </TableRow>
      </Table>
      <br />
      <AttendanceTable
        attendance={selectedStaff?.Attendance}
        leave={selectedStaff?.Leave}
      />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography>{t("deduction")}</Typography>
            </TableCell>
            <TableCell>
              <TextField
                disabled={readOnly}
                defaultValue={0}
                {...register("deduction")}
                inputProps={{ min: 0 }}
                type="number"
                sx={{
                  border: "none",
                }}
                variant="standard"
                InputProps={{
                  startAdornment: "-$",
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>{t("allowance")}</Typography>
            </TableCell>
            <TableCell>
              <TextField
                disabled={readOnly}
                defaultValue={0}
                {...register("allowance")}
                type="number"
                inputProps={{ min: 0 }}
                sx={{
                  border: "none",
                }}
                variant="standard"
                InputProps={{
                  startAdornment: "+$",
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>{t("mpf")}</Typography>
            </TableCell>
            <TableCell>
              <TextField
                disabled
                type="number"
                // inputProps={{ min: 0 }}
                {...register("MPF")}
                sx={{
                  border: "none",
                }}
                value={mpfAmount <= 0 ? 0 : mpfAmount}
                variant="standard"
                InputProps={{
                  startAdornment: "-$",
                }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>{t("net-salary")}</Typography>
            </TableCell>
            <TableCell>
              <TextField
                disabled
                inputProps={{ min: 0 }}
                {...register("netSalary")}
                sx={{
                  border: "none",
                }}
                type="number"
                value={netSalaryAmount <= 0 ? 0 : netSalaryAmount}
                variant="standard"
                InputProps={{
                  startAdornment: "$",
                }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  );
};

export default PayslipForm;
