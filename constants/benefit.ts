export const columns = [
  {
    label: "name",
    accessor: "name",
  },
  { label: "description", accessor: "description" },
  {
    label: "designation_count",
    accessor: "_count.designation",
  },
  {
    label: "staff_count",
    accessor: "_count.staff",
  },
];
