import React, { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  Stack,
  Button,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Grid,
} from "@mui/material";
import Autocomplete from "components/Autocomplete";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { string, object, number, array } from "yup";
import { useItems, getItem, upsertItem } from "lib/swr";

const defaultValues = {
  StaffId: "",
  date: "",
  leaveType: "ANNUAL_LEAVE",
  status: "A",
};

export const schema = object().shape({
  StaffId: string().required("required"),
  date: string().required("required"),
  timeIn: string().optional(),
  timeOut: string().optional(),
  leaveType: string().required("required"),
  remark: string().optional(),
  status: string().required("required"),
});

export type FormData = ReturnType<(typeof schema)["cast"]>;

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

const BenefitForm = () => {
  const router = useRouter();

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const { t } = useTranslation("common", { keyPrefix: "benefit" });
  const methods = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const { data: { items: staff } = { total: 0, items: [] } } =
    useItems("/api/staff/all");

  useEffect(() => {
    if (!isNew) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(`/api/leave/${id}`);
          if (item) {
            reset({
              ...item,
              Staff: generateStaffOptions(staff),
            });
          }
        } catch (err) {
          toast.error("Error fetching benefit");
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
      const response = await upsertItem(`/api/leave/${id}`, data);
      router.push("/company/attendance");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  // const costType = methods.watch("costType");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {isNew ? t("create-leave") : t("update-leave")}
      </Typography>
      <FormProvider {...methods}>
        <Stack spacing={2} direction="column">
          <Stack spacing={1}>
            <Typography>{t("staff")}</Typography>
            <FormControl fullWidth error={!!errors.StaffId}>
              <Controller
                control={methods.control}
                name="StaffId"
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(e) =>
                      methods.setValue("StaffId", e.target.value)
                    }
                  >
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
          <Stack spacing={1}>
            <Typography>{t("date")}</Typography>
            <TextField
              type="date"
              {...register("date")}
              error={!!errors.date}
              helperText={errors.date?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("timeIn")}</Typography>
            <TextField
              type="time"
              {...register("timeIn")}
              error={!!errors.timeIn}
              helperText={errors.timeIn?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("timeOut")}</Typography>
            <TextField
              type="time"
              {...register("timeOut")}
              error={!!errors.timeOut}
              helperText={errors.timeOut?.message}
              fullWidth
            />
          </Stack>
          <Stack>
            <Typography>{t("leave-type")}</Typography>
            <FormControl fullWidth>
              <Controller
                control={methods.control}
                name="leaveType"
                render={({ field }) => (
                  <Select {...field}>
                    <MenuItem value="ANNUAL_LEAVE">
                      {t("annual-leave")}
                    </MenuItem>
                    <MenuItem value="SICK_LEAVE">{t("sick-leave")}</MenuItem>
                    <MenuItem value="NO_PAY_LEAVE">
                      {t("no-pay-leave")}
                    </MenuItem>
                    <MenuItem value="OTHERS">{t("others")}</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("remark")}</Typography>
            <TextField
              type="text"
              {...register("remark")}
              error={!!errors.timeOut}
              helperText={errors.timeOut?.message}
              fullWidth
            />
          </Stack>

          {!isNew && (
            <Stack>
              <Typography>{t("status")}</Typography>
              <FormControl fullWidth>
                <Controller
                  control={methods.control}
                  name="status"
                  render={({ field }) => (
                    <Select {...field}>
                      <MenuItem value="A">{t("active")}</MenuItem>
                      <MenuItem value="I">{t("inactive")}</MenuItem>
                      <MenuItem value="D">{t("deleted")}</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Stack>
          )}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {t(isNew ? "create" : "update")}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Stack>
  );
};

export default BenefitForm;
