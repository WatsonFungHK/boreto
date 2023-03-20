import type { Column } from "components/BasicTable";


export const columns: Array<Column> = [
  {
    label: "first_name",
    accessor: "first_name",
  },
  { label: "last_name", accessor: "last_name" },
  {
    label: "department",
    accessor: "department.name",
  },
  {
    label: "office",
    accessor: "office.name",
  },
];