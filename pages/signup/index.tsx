import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { string, object, InferType } from "yup";
import {
  TextField,
  OutlinedInput,
  Button,
  Stack,
  Icon,
  IconButton,
  Typography,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import axiosClient from "lib/axiosClient";
import { toast } from "react-toastify";
import { getCsrfToken, signIn } from "next-auth/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

// Define the validation schema
const schema = object().shape({
  last_name: string().max(50).required("required"),
  first_name: string().max(50).required("required"),
  email: string().required("required"),
  password: string().min(8, "min").required("required"),
});

type FormData = InferType<typeof schema>;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

const SignUpForm = ({ csrfToken }) => {
  const { t } = useTranslation();
  // const {} = useSession();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      await axiosClient.post("/api/auth/register", formData);

      await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        csrfToken,
        // @ts-ignore
      });
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "500px",
        }}
      >
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">{t("first_name")}</Typography>
            <TextField
              type="first_name"
              {...register("first_name")}
              error={!!errors.first_name}
              helperText={errors.first_name && t(errors.first_name.message)}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2">{t("last_name")}</Typography>
            <TextField
              type="last_name"
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name && t(errors.last_name.message)}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2">{t("email")}</Typography>
            <TextField
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email && t(errors.email.message)}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2">{t("password")}</Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password && t(errors.password.message)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <LoadingButton
            loading={loading}
            type="submit"
            variant="contained"
            color="primary"
          >
            {t("Create account")}
          </LoadingButton>
        </Stack>
      </form>
      <Typography variant="body2" sx={{ textDecoration: "none" }}>
        Already have an account? <Link href="/login">Sign in</Link>
      </Typography>
    </Stack>
  );
};

SignUpForm.auth = false;
SignUpForm.getLayout = (page) => page;

export default SignUpForm;
