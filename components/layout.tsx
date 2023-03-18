import {
  Stack,
  Box,
  ListItemText,
  ListItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import SideMenu from "./SideMenu";
import Header from "./Header";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        height: "100vh",
      }}
    >
      <SideMenu />
      <Stack sx={{ width: "100%" }}>
        <Header />
        <main>{children}</main>
      </Stack>
    </Stack>
  );
};

export default Layout;
