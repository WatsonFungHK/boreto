import {
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import colors from "theme/colors";
import ProductCategoryIcon from "@mui/icons-material/Category";
import ProductIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export const menuItems = [
  {
    label: "Product Category",
    icon: <ProductCategoryIcon />,
    link: "/product/category",
  },
  { label: "Product", icon: <ProductIcon />, link: "/product" },
  { label: "Inventory", icon: <InventoryIcon />, link: "/inventory" },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  return (
    <Stack direction={"row"}>
      <Stack
        sx={{
          color: "white",
          width: "200px",
          height: "100vh",
          paddingTop: "24px",
          borderRight: "1px solid",
          borderColor: colors.grey30,
          backgroundColor: colors.darkBlue80,
        }}
      >
        {menuItems.map(({ link, label, icon }) => {
          const isActive = router.pathname.includes(link);
          return (
            <Link href={link} key={link}>
              <ListItem
                sx={{
                  svg: {
                    fill: isActive ? "white" : colors.grey90,
                  },
                  "&:hover": {
                    backgroundColor: colors.grey70,
                    color: "white",
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  sx={{
                    color: isActive ? "white" : colors.grey90,
                  }}
                >
                  {label}
                </ListItemText>
              </ListItem>
            </Link>
          );
        })}
      </Stack>
      {children}
    </Stack>
  );
};

export default Layout;
