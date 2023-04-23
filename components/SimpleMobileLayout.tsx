import { useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import { useRouter } from "next/router";

const TABS = [
  {
    label: "Validate",
    destination: "/phone-validation",
  },
  {
    label: "History",
    destination: "/phone-validation/history",
  },
];

const Header = ({}) => {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar
        sx={(theme) => ({
          minHeight: "40px",
        })}
      >
        Boreto
      </Toolbar>
    </AppBar>
  );
};

const SimpleMobileLayout = ({ children }) => {
  return (
    <Stack>
      <Header />
      <Stack
        sx={{
          padding: "8px 16px",
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};

export default SimpleMobileLayout;
