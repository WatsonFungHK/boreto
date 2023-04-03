import {
  Button,
  MenuItem,
  Pagination,
  Stack,
  Typography,
  Select,
} from "@mui/material";
import axiosClient from "lib/axiosClient";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import BasicTable from "components/BasicTable";
import { useState } from "react";
import DebouncedInput from "components/DebouncedInput";
import { columns } from "./_constants";

const fetcher = async ({ url, filters }) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await axiosClient.get(url + "?" + queryParams);
  return response.data;
};

const Overview = () => {
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10); // pageSize
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("all");
  const {
    data: { total, items } = { total: 0, items: [] },
    error,
    isLoading,
  } = useSWR(
    {
      url: "/api/product/all",
      filters: {
        pageNumber,
        pageSize,
        keyword,
        type,
      },
    },
    fetcher
  );
  const { t } = useTranslation();

  const goToCreate = () => {
    router.push("/product/product/new");
  };

  return (
    <Stack spacing={2}>
      <Typography>{t("product")}</Typography>
      <Stack
        justifyContent={"space-between"}
        direction="row"
        alignItems={"center"}
      >
        <Stack spacing={1} direction="row">
          <DebouncedInput
            debounceTimeout={500}
            onKeyUp={(value) => {
              setKeyword(value);
              setPageNumber(1);
            }}
          />
          <Select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPageNumber(1);
            }}
            sx={{
              "> div": {
                padding: "0 14px",
              },
            }}
          >
            <MenuItem value={"all"}>{t("all")}</MenuItem>
            <MenuItem value={"P"}>{t("product")}</MenuItem>
            <MenuItem value={"S"}>{t("service")}</MenuItem>
          </Select>
        </Stack>
        <Button variant="contained" onClick={goToCreate}>
          {t("create")}
        </Button>
      </Stack>
      <BasicTable
        rows={items}
        columns={columns}
        pageSize={pageSize}
        isLoading={isLoading}
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

export default Overview;
