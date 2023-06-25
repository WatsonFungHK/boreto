import { Divider, Stack, TextField } from "@mui/material";
import ItemForm, { orderItemSchema } from "../../../components/ItemForm";
import InfoForm from "../../../components/InfoForm";
import MoneyForm from "../../../components/MoneyForm";
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

const schema = object().shape({
  sum: number(),
  orderItems: array().of(orderItemSchema).required(),
  externalId: string().required(),
  payslipDate: string().required(),
  effectiveDate: string().optional().nullable(),
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
  const methods = useForm({
    defaultValues: {
      orderItems: [{}],
      payslipDate: getDateString(),
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const item = await getItem(`/api/payslip/${id}`);
          console.log("item: ", item);
          getItem;
          methods.reset(item.payload);
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
      router.push("/payslip");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <PayslipForm readOnly={!isNew} />
      <Divider
        sx={{
          margin: "56px 0 0",
        }}
      />
      <MoneyForm />
      <TextField
        sx={{ mb: "20px" }}
        placeholder="Remark"
        multiline
        rows={2}
        maxRows={4}
      />
      <LoadingButton
        type="submit"
        variant="contained"
        loading={isLoading}
        onClick={methods.handleSubmit(onSubmit)}
      >
        {t("create")}
      </LoadingButton>
    </FormProvider>
  );
};

export default FormContainer;
