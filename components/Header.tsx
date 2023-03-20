// Header.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Avatar, Stack, Typography } from "@mui/material";
import colors from "theme/colors";

const Header: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={(theme) => ({
        // height: "65px",
        borderBottom: "1px solid",
        padding: "8px 32px",
        borderColor: colors.grey30,
      })}
    >
      <Avatar
        sx={{
          width: "24px",
          height: "24px",
        }}
      >
        {session?.user?.email[0]}
      </Avatar>
    </Stack>
  );
};

export default Header;
