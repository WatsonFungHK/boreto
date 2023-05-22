import type { Column } from "components/BasicTable";


export const columns: Array<Column> = [
  {
    label: "name",
    accessor: "name",
  },
  {
    label: "type",
    accessor: "type",
    format: (value) => {
      return (value === 'P' ? 'Product' : 'Service') as string;
    }
  },
  {
    label: "price",
    accessor: "price",
  },
  {
    label: "unit",
    accessor: "unit",
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