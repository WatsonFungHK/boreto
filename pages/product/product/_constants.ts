import type { Column } from "components/BasicTable";


export const columns: Array<Column> = [
  {
    label: "name",
    accessor: "name",
  },
  { label: "description", accessor: "description" },
  {
    label: "price",
    accessor: "price",
  },
  {
    label: "category",
    accessor: "category.name",
  },
  {
    label: "supplier",
    accessor: "supplier.name",
  },
];