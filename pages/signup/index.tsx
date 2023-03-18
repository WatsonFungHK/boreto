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
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import axiosClient from "lib/axiosClient";
import { toast } from "react-toastify";

// Define the validation schema
const schema = object().shape({
  username: string().required("username.required"),
  password: string().min(8, "password.min").required("password.required"),
});

type FormData = InferType<typeof schema>;

const SignUpForm = () => {
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
      const response = await axiosClient.post("/api/auth/register", formData);

      const LoginResponse = await axiosClient.post("/api/auth/login", formData);
    } catch (error) {
      toast.error(error.response.data.error);
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

export default SignUpForm;
