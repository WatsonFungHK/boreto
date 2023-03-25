import React, { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
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
import { string, object, array } from "yup";
import { useItems, getItem, upsertItem } from "lib/swr";
import Autocomplete from "components/Autocomplete";

const defaultValues = {
  name: "",
  description: "",
  status: "A", // 'A' = Active, 'I' = Inactive, 'D' = Deleted
  permissions: [],
  users: [],
};

export const schema = object().shape({
  name: string().required("required"),
  description: string().optional(),
  status: string().required("required"),
  permissions: array(),
  users: array(),
});

export type FormData = ReturnType<typeof schema["cast"]>;

const generateUserOptions = (users = []) => {
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

const generatePermissionOptions = (permissions) => {
  return permissions.map(({ id, name }) => {
    return {
      value: id,
      label: name,
    };
  });
};

const RoleForm = ({}: {}) => {
  const router = useRouter();

  const {
    query: { id },
  } = router;
  const isNew = id === "new";

  const { t } = useTranslation("common", { keyPrefix: "role" });
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
  const { data: { items: users } = { total: 0, items: [] } } =
    useItems("/api/staff/all");
  const { data: { items: permissions } = { total: 0, items: [] } } = useItems(
    "/api/permission/all"
  );

  useEffect(() => {
    if (!isNew) {
      const fetchItem = async () => {
        try {
          setIsLoading(true);
          const item: FormData = await getItem(`/api/role/${id}`);
          if (item) {
            reset({
              ...item,
              users: generateUserOptions(item.users.map(({ user }) => user)),
              permissions: generatePermissionOptions(
                item.permissions.map(({ permission }) => permission)
              ),
            });
          }
        } catch (err) {
          toast.error("Error fetching role");
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
      const response = await upsertItem(`/api/role/${id}`, {
        ...data,
        users: data.users.map(({ value }) => value),
        permissions: data.permissions.map(({ value }) => value),
      });
      router.push("/company/role");
      toast.success(isNew ? t("created-success") : "updated-success");
    } catch (err) {
      toast.error(isNew ? t("created-error") : "updated-error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {isNew ? t("create-role") : t("update-role")}
      </Typography>
      <FormProvider {...methods}>
        <Stack spacing={2} direction="column">
          <Stack spacing={1}>
            <Typography>{t("name")}</Typography>
            <TextField
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          </Stack>
          <Stack spacing={1}>
            <Typography>{t("description")}</Typography>
            <TextField
              multiline
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
            />
          </Stack>

          <Autocomplete
            options={generateUserOptions(users)}
            name="users"
            subtitle="assigned-staff"
          />
          <Autocomplete
            options={generatePermissionOptions(permissions)}
            name="permissions"
            subtitle="permissions"
          />
          {!isNew && (
            <Stack spacing={1}>
              <Typography>{t("status")}</Typography>
              <FormControl fullWidth error={!!errors.status}>
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

export default RoleForm;
