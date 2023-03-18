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
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";
import axiosClient from "lib/axiosClient";
import { useRouter } from "next/router";

const schema = object().shape({
  username: string().required("username.required"),
  password: string().min(8, "password.min").required("password.required"),
});

type FormData = InferType<typeof schema>;

const LoginForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
      const response = await signIn("credentials", {
        redirect: false,
        ...formData,
        // @ts-ignore
      });

      if (response.ok) {
        router.push("/dashboard");
        toast.success("Login successfully");
      }
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
            <Typography variant="subtitle2">{t("email")}</Typography>
            <TextField
              type="email"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username && t(errors.username.message)}
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
            {t("Login")}
          </LoadingButton>
        </Stack>
      </form>
      <Typography variant="body2" sx={{ textDecoration: "none" }}>
        Don't have an account? <Link href="/signup">Sign up</Link>
      </Typography>
    </Stack>
  );
};

export default LoginForm;
