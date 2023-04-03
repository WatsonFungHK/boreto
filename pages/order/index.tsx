import { Button, Pagination, Stack, Typography } from "@mui/material";
import axiosClient from "lib/axiosClient";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import BasicTable from "components/BasicTable";
import type { Column } from "components/BasicTable";
import { useState } from "react";
import DebouncedInput from "components/DebouncedInput";
import dayjs from "dayjs";

const fetcher = async ({ url, filters }) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axiosClient.get(url + "?" + queryParams);
  return response.data;
};

const columns: Array<Column> = [
  {
    label: "created_at",
    accessor: "createdAt",
    format: (value: any) => dayjs(value).format("YYYY-MM-DD HH:mm"),
  },
  {
    label: "total_amount",
    accessor: "totalAmount",
  },
  {
    label: "order_items",
    accessor: "orderItems",
    format: (value: any, row) => {
      const names = value.map((v: any) => v.name);
      return names.join(", ");
    },
  },
  {
    label: "delivery_status",
    accessor: "Shipping",
    format: (value: any, row) => {
      if (Array.isArray(value) && value.length > 0) {
        return value[value.length - 1].status;
      }
      return undefined;
    },
  },
  {
    label: "customer_name",
    accessor: "name",
    format: (value: any, row: any) =>
      row.customer.first_name + " " + row.customer.last_name,
  },
];

const TableContainer = ({ filters = {}, onRowClick }) => {
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10); // pageSize
  const [keyword, setKeyword] = useState("");
  const {
    data: { total, items } = { total: 0, items: [] },
    error,
    isLoading,
  } = useSWR(
    {
      url: "/api/order/all",
      filters: {
        pageNumber,
        pageSize,
        keyword,
        ...filters,
      },
    },
    fetcher
  );
  const { t } = useTranslation();

  const goToCreate = () => {
    router.push("/order/new");
  };

  return (
    <Stack spacing={2}>
      <Typography>{t("order")}</Typography>
      <Stack
        justifyContent={"space-between"}
        direction="row"
        alignItems={"center"}
      >
        <DebouncedInput
          debounceTimeout={500}
          onKeyUp={(value) => {
            setKeyword(value);
            setPageNumber(1);
          }}
        />
        <Button variant="contained" onClick={goToCreate}>
          {t("create")}
        </Button>
      </Stack>
      <BasicTable
        rows={items}
        columns={columns}
        pageSize={pageSize}
        isLoading={isLoading}
        onRowClick={onRowClick}
      />
      {!isLoading && items?.length === 0 && (
        <Stack
          textAlign={"center"}
          sx={{
            width: "100%",
          }}
        >
          <Typography>{t("no-data")}</Typography>
        </Stack>
      )}
      <Pagination
        count={Math.ceil(total / pageSize)} // Total number of pages
        page={pageNumber}
        onChange={(event, page) => setPageNumber(page)}
        color="primary"
        size="large"
      />
    </Stack>
  );
};

export default TableContainer;
