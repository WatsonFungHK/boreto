// I want to generate a new form
// derive the title and fields from the following prisma schema
// always skip id, created_at, updated_at, companyId
/**
 * 
model Role {
  id          String           @id @default(cuid())
  name        String
  description String?
  permissions RolePermission[]
  users       UserRole[]
  company     Company          @relation(fields: [companyId], references: [id])
  created_at  DateTime         @default(now())
  status      String           @default("A") // 'A' = Active, 'I' = Inactive, 'D' = Deleted
  updated_at  DateTime?        @updatedAt
  companyId   String
}
 */

// This is the example of how to generate a form
// the title was 'customer' which will be used to generate the name of the component and api endpoint, and related text
// the fields were first_name, last_name, gender, credit_amount, birth_date
// special request: I wanted first_name and last_name in the same line

// example:
import React, { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosClient from "lib/axiosClient";
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
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { string, object, date, number } from "yup";
import { useItems, getItem, upsertItem } from "lib/swr";

const defaultValues = {
  first_name: "",
  last_name: "",
  gender: "",
  credit_amount: 0,
  birth_date: undefined,
  status: "A",
};

export const schema = object().shape({
  first_name: string().required("required"),
  last_name: string().optional(),
  gender: string().optional(),
  credit_amount: number().positive().optional(),
  birth_date: date().optional().nullable(),
});

export type FormData = ReturnType<typeof schema["cast"]>;

const GENDERS = [
  { value: "M", label: "male" },
  { value: "F", label: "female" },
  { value: "U", label: "unspecified" },
];

const CustomerForm = ({}: {}) => {
  const router = useRouter();

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const { t } = useTranslation("common", { keyPrefix: "customer" });
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

  useEffect(() => {
    if (!isNew) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item = await getItem(`/api/customer/${id}`);
          if (item) {
            reset(item);
          }
        } catch (err) {
          toast.error("Error fetching customer");
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
      const response = await upsertItem(`/api/customer/${id}`, data);
      router.push("/customer");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  //simply return null is ok
  return "Dont write any thing here";
};

export default CustomerForm;
