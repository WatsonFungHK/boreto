import type { Column } from "components/BasicTable";


export const columns: Array<Column> = [
  {
    label: "name",
    accessor: "name",
  },
  { label: "description", accessor: "description" },
  {
    label: "permissions",
    accessor: "permissions",
    format: (value) => {
      return value.map((v) => v.permission.name).join(', ') as string;
    }
  },
  {
    label: "user_count",
    accessor: "_count.users",
  },
];