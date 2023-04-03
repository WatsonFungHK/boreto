import { Button, Pagination, Stack, Typography } from "@mui/material";
import axiosClient from "lib/axiosClient";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import BasicTable from "components/BasicTable";
import type { Column } from "components/BasicTable";
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
  const {
    data: { total, items } = { total: 0, items: [] },
    error,
    isLoading,
  } = useSWR(
    {
      url: "/api/department/all",
      filters: {
        pageNumber,
        pageSize,
        keyword,
      },
    },
    fetcher
  );
  const { t } = useTranslation();

  const goToCreate = () => {
    router.push("/company/department/new");
  };

  return (
    <Stack spacing={2}>
      <Typography>{t("department")}</Typography>
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
