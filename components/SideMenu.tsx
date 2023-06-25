import {
  Dashboard as DashboardIcon,
  People as CustomersIcon,
  ShoppingCart as ProductsIcon,
  ListAlt as OrdersIcon,
  Business as CompanyIcon,
  LocalShipping as SupplierIcon,
  Business,
  Room,
  People,
  AssignmentInd,
  Settings,
} from "@mui/icons-material";
import { ListItem, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Header from "./Header";
import colors from "theme/colors";
import NestedMenu from "./NestedMenu";
import ProductCategoryIcon from "@mui/icons-material/Category";
import ProductIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import AssessmentIcon from "@mui/icons-material/Assessment";

export const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
  { label: "Customers", icon: <CustomersIcon />, link: "/customer" },
  {
    label: "Products",
    icon: <ProductsIcon />,
    link: "/product/category",
    baseLink: "/product",
    subLinks: [
      {
        label: "Category",
        icon: <ProductCategoryIcon />,
        link: "/product/category",
      },
      { label: "Product", icon: <ProductIcon />, link: "/product/product" },
      {
        label: "Inventory",
        icon: <InventoryIcon />,
        link: "/product/inventory",
      },
    ],
  },
  { label: "Quotation", icon: <OrdersIcon />, link: "/quotation" },
  { label: "Orders", icon: <OrdersIcon />, link: "/order" },
  { label: "supplier", icon: <SupplierIcon />, link: "/supplier" },
  {
    label: "Company",
    icon: <CompanyIcon />,
    link: "/company/department",
    baseLink: "/company",
    subLinks: [
      {
        label: "attendance",
        icon: <People />,
        link: "/company/attendance",
      },
      {
        label: "department",
        icon: <Business />,
        link: "/company/department",
      },
      {
        label: "office",
        icon: <Room />,
        link: "/company/office",
      },
      {
        label: "staff",
        icon: <People />,
        link: "/company/staff",
      },
      {
        label: "designation",
        icon: <AssignmentInd />,
        link: "/company/designation",
      },
      {
        label: "benefit",
        icon: <AssignmentInd />,
        link: "/company/benefit",
      },
      {
        label: "payslip",
        icon: <AssignmentInd />,
        link: "/company/payslip",
      },
      {
        label: "role",
        icon: <AssignmentInd />,
        link: "/company/role",
      },
      {
        label: "shipping",
        icon: <Settings />,
        link: "/company/shipping-method",
      },
      {
        label: "payment",
        icon: <Settings />,
        link: "/company/payment-method",
      },
      {
        label: "settings",
        icon: <Settings />,
        link: "/company/settings",
      },
    ],
  },
];

export const expandedWidth = "250px";
export const collapsedWidth = "60px";

const SideMenu = ({ isExpanded }: { isExpanded: boolean }) => {
  const router = useRouter();

  return (
    <Stack
      sx={{
        overflow: "auto",
        color: "white",
        width: isExpanded ? expandedWidth : collapsedWidth,
        height: "100vh",
        paddingTop: "24px",
        borderRight: "1px solid",
        borderColor: colors.grey30,
        backgroundColor: colors.darkBlue80,
      }}
    >
      {menuItems.map(({ link, label, icon, baseLink, subLinks }) => {
        const compareLink = baseLink || link;
        const isActive = router.pathname.includes(compareLink);
        return (
          <Stack key={link}>
            <Link href={link}>
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
                {isExpanded && (
                  <ListItemText
                    sx={{
                      color: isActive ? "white" : colors.grey90,
                    }}
                  >
                    {label}
                  </ListItemText>
                )}
              </ListItem>
            </Link>
            {isActive && (
              <Stack sx={{ marginLeft: "50px" }}>
                {subLinks?.map(({ link, label, icon }) => {
                  const isSublinkActive = router.pathname.includes(link);
                  return (
                    <Link href={link} key={link}>
                      <ListItem
                        sx={{
                          svg: {
                            fill: isSublinkActive ? "white" : colors.grey90,
                          },
                          "&:hover": {
                            backgroundColor: colors.grey70,
                            color: "white",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <ListItemIcon>{icon}</ListItemIcon>
                        {isExpanded && (
                          <ListItemText
                            sx={{
                              color: isSublinkActive ? "white" : colors.grey90,
                            }}
                          >
                            {label}
                          </ListItemText>
                        )}
                      </ListItem>
                    </Link>
                  );
                })}
              </Stack>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export default SideMenu;
