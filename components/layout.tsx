import {
  Stack,
  Box,
  ListItemText,
  ListItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import SideMenu, { expandedWidth, collapsedWidth } from "./SideMenu";
import Header from "./Header";
import { ReactNode, useEffect } from "react";
import colors from "theme/colors";
import { useRouter } from "next/router";

const Layout = ({ children }: { children: ReactNode }) => {
  // const router = useRouter();
  // const isExpanded = !router.pathname.includes("/product");
  const isExpanded = true;

  return (
    <Stack
      direction={"row"}
      sx={{
        height: "100vh",
      }}
    >
      <SideMenu isExpanded={isExpanded} />
      <Stack
        sx={{
          width: `calc(100% - ${isExpanded ? expandedWidth : collapsedWidth})`,
        }}
      >
        <Header />
        <Stack
          component={"main"}
          sx={{
            backgroundColor: colors.grey5,
            padding: "24px 32px",
            height: "calc(100% - 80px)",
            overflow: "scroll",
          }}
        >
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Layout;
