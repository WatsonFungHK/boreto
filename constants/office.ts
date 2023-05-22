export const columns= [
  {
    label: "name",
    accessor: "name",
  },
  { label: "description", accessor: "description" },
  { label: 'type', accessor: 'type' },
  {
    label: "staff_count",
    accessor: "_count.users",
  },
];
