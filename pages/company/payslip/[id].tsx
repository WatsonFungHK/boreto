import { Divider, Stack, TextField } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { getDateString } from "utils/date";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { array, number, object, date, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useItems, getItem, upsertItem } from "lib/swr";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import TermsForm from "../../../components/TermsForm";
import PayslipForm from "components/PayslipForm";

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

const schema = object().shape({
  id: string().optional(),
  staffId: string().required(),
  payPeriod: string().required(),
  settleDate: string().required(),
  deduction: string().optional().nullable(),
  allowance: string().optional().nullable(),
  netSalary: number().optional().nullable(),
  MPF: number().optional().nullable(),
  payrollStatus: string().required(),
  remark: string().optional().nullable(),
});

export type FormData = ReturnType<(typeof schema)["cast"]>;

const FormContainer = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const isNew = id === "new";
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<FormData>({
    defaultValues: {
      payrollStatus: "PENDING",
      deduction: "0",
      allowance: "0",
      remark: "remark here",
    },
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = methods;

  const { data: { items: staff } = { total: 0, items: [] } } =
    useItems("/api/staff/all");
  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const item = await getItem(`/api/payslip/${id}`);
          console.log({ item });
          reset({
            id: item.id,
            staffId: item.staffId,
            staff: generateStaffOptions(staff),
            payPeriod: item.payPeriod,
            settleDate: getDateString(item.settleDate),
            ...item.payload,
          });
        } catch (err) {
          toast.error(t("fetch-error"));
        }
      })();
    }
  }, [isNew]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await upsertItem(`/api/payslip/${id}`, data);
      router.push("/company/payslip");
      toast.success(t("created-success"));
    } catch (err) {
      toast.error(t("created-error"));
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await upsertItem(`/api/payslip/${id}`, {
        id: getValues("id"),
        payrollStatus: getValues("payrollStatus"),
      });
      router.push("/company/payslip");
      toast.success("updated-success");
    } catch (err) {
      toast.error("updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <PayslipForm readOnly={!isNew} methods={methods} />
      <Divider
        sx={{
          margin: "56px 0 0",
        }}
      />
      <TextField
        sx={{ mb: "20px" }}
        placeholder="Remark"
        multiline
        rows={2}
        disabled={!isNew}
        {...register("remark")}
      />
      {isNew ? (
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isLoading}
          onClick={handleSubmit(onSubmit)}
        >
          {t("create")}
        </LoadingButton>
      ) : (
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isLoading}
          onClick={() => onUpdate()}
        >
          {t("update")}
        </LoadingButton>
      )}
    </FormProvider>
  );
};

export default FormContainer;
