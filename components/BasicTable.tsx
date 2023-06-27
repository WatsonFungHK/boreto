import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import _ from "lodash";
import {} from "@mui/lab";
import { Skeleton } from "@mui/material";

export interface Column {
  label: string;
  accessor: string;
  format?: (value: any, row: any, index: number) => any | React.ReactNode;
}

const createArrayFromNumber = (num) => {
  const arr = [];
  for (let i = 1; i <= num; i++) {
    arr.push(i);
  }
  return arr;
};

const myNum = 5;
const myArray = createArrayFromNumber(myNum);

export default function BasicTable({
  rows = [],
  columns,
  pageSize,
  isLoading,
  onRowClick,
  displayHeader = true,
}: {
  rows: Array<any>;
  columns: Array<Column>;
  pageSize: number;
  isLoading: boolean;
  onRowClick?: Function;
  displayHeader?: boolean;
}) {
  const router = useRouter();
  const { t } = useTranslation();

  const defaultOnClick = (row) => () => {
    console.log({ row });

    if (typeof onRowClick === "function") {
      onRowClick(row);
    } else {
      if (row?.type === "Leave") {
        router.push(`leave/${row.id}`);
        return;
      }
      router.push(`${router.pathname}/${row.id}`);
    }
  };

  const renderRows = () => {
    return rows.map((row, index) => (
      <TableRow
        key={row.id}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          cursor: "pointer",
        }}
        onClick={defaultOnClick(row)}
      >
        {columns.map(({ accessor, format = (value, row, index) => value }) => {
          let value = _.get(row, accessor);
          return (
            <TableCell
              key={accessor}
              sx={{
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {format(value, row, index)}
            </TableCell>
          );
        })}
      </TableRow>
    ));
  };

  const renderSkeleton = () => {
    const skeletonRows = createArrayFromNumber(pageSize);
    return skeletonRows.map((row, index) => (
      <TableRow
        key={index}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          cursor: "pointer",
        }}
      >
        {columns.map(({ accessor }) => (
          <TableCell key={accessor}>
            <Skeleton
              variant="text"
              sx={
                {
                  // width: "100%",
                }
              }
            />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        {displayHeader && (
          <TableHead>
            <TableRow>
              {columns.map(({ label, accessor }) => (
                <TableCell
                  key={accessor}
                  sx={{
                    // make it ellsipis
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t(label)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>{isLoading ? renderSkeleton() : renderRows()}</TableBody>
      </Table>
    </TableContainer>
  );
}
