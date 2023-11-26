import { Button, Pagination, Stack, Typography } from "@mui/material";
import axiosClient from "lib/axiosClient";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import BasicTable from "components/BasicTable";
import type { Column } from "components/BasicTable";
import { useEffect, useState } from "react";
import DebouncedInput from "components/DebouncedInput";
import { useItems } from "lib/swr";
import { columns } from "../../../constants/attendance";

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
  const attendance = useSWR(
    {
      url: "/api/attendance/all",
      filters: {
        pageNumber,
        pageSize,
        keyword,
      },
    },
    fetcher
  );
  const leave = useSWR(
    {
      url: "/api/leave/all",
      filters: {
        pageNumber,
        pageSize,
        keyword,
      },
    },
    fetcher
  );

  const total = attendance.data?.total || 0 + leave.data?.total || 0;
  const items = [
    ...(attendance?.data?.items ?? []),
    ...(leave?.data?.items ?? []),
  ].map((item) => ({
    ...item,
    name: item.Staff.first_name + " " + item.Staff.last_name,
    type: item.leaveType ? "Leave" : "Attendance",
  }));

  const isLoading = attendance.isLoading || leave.isLoading;

  const { t } = useTranslation();

  const goToCreateAttendance = () => {
    router.push("/company/attendance/new");
  };

  const goToCreateLeave = () => {
    router.push("/company/leave/new");
  };

  return (
    <Stack spacing={2}>
      <Typography>{t("attendance")}</Typography>
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
        <Button variant="contained" onClick={goToCreateAttendance}>
          {t("create-attendance")}
        </Button>
        <Button variant="contained" onClick={goToCreateLeave}>
          {t("create-leave")}
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
