import { Divider, Stack } from "@mui/material";
import ItemForm, { orderItemSchema } from "../../components/ItemForm";
import InfoForm from "../../components/InfoForm";
import MoneyForm from "../../components/MoneyForm";
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
import TermsForm from "../../components/TermsForm";

const schema = object().shape({
  sum: number(),
  orderItems: array().of(orderItemSchema).required(),
  externalId: string().required(),
  quotationDate: string().required(),
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
      quotationDate: getDateString(),
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
          const item = await getItem(`/api/quotation/${id}`);
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
      const response = await upsertItem(`/api/quotation/${id}`, data);
      router.push("/quotation");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <InfoForm readOnly={!isNew} />
      <ItemForm readOnly={!isNew} />
      <Divider
        sx={{
          margin: "56px 0 0",
        }}
      />
      <MoneyForm />
      <TermsForm readOnly={!isNew} />
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
