import useSWR from "swr";
import { fetcher } from "lib/swr";
import { Grid, Stack, Typography, Card, CardContent } from "@mui/material";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import colors from "theme/colors";
import BasicTable from "components/BasicTable";
import { useRouter } from "next/router";

type AnalysisData = Array<{
  id: string;
  name: string;
  _count: {
    products: number;
  };
}>;

const Supplier = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: suppliers,
    error,
    isLoading,
  } = useSWR<AnalysisData>(
    {
      url: "/api/analysis/supplier/total",
    },
    fetcher
  );

  return (
    <Stack>
      <Card>
        <CardContent>
          <Typography>{t("top-supplier")}</Typography>
          <Stack spacing={1}>
            <BasicTable
              rows={suppliers || []}
              onRowClick={(row) => {
                router.push(`/supplier/${row.id}`);
              }}
              columns={[
                {
                  label: "",
                  accessor: "id",
                  format: (value, row, index) => (
                    <Stack
                      sx={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: colors.darkBlue90,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography sx={{ color: "white" }}>
                        {index + 1}
                      </Typography>
                    </Stack>
                  ),
                },
                {
                  label: "name",
                  accessor: "name",
                },
                {
                  label: "",
                  accessor: "_count.products",
                  format: (value, row, index) => (
                    <Typography sx={{ color: colors.darkBlue90 }}>
                      {t("providing")} {value} {t("products")}
                    </Typography>
                  ),
                },
              ]}
              pageSize={5}
              isLoading={isLoading}
              displayHeader={false}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
export default Supplier;
