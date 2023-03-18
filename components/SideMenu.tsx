import {
  Dashboard as DashboardIcon,
  People as CustomersIcon,
  ShoppingCart as ProductsIcon,
  ListAlt as OrdersIcon,
  Business as CompanyIcon,
  LocalShipping as SupplierIcon,
} from "@mui/icons-material";
import { ListItem, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import colors from "theme/colors";

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
  { label: "Customers", icon: <CustomersIcon />, link: "/customer" },
  { label: "Products", icon: <ProductsIcon />, link: "/product" },
  { label: "Orders", icon: <OrdersIcon />, link: "/order" },
  { label: "supplier", icon: <SupplierIcon />, link: "/supplier" },
  { label: "Company", icon: <CompanyIcon />, link: "/company" },
];

const SideMenu = () => {
  const router = useRouter();

  return (
    <Stack
      sx={{
        color: "white",
        width: "300px",
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
                  fill: isActive ? "white" : colors.grey70,
                },
                "&:hover": {
                  backgroundColor: colors.grey20,
                  color: "white",
                },
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                sx={{
                  color: isActive ? "white" : colors.grey70,
                }}
              >
                {label}
              </ListItemText>
            </ListItem>
          </Link>
        );
      })}
    </Stack>
  );
};

export default SideMenu;
