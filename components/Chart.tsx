import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Paper } from "@mui/material";

const data = [
  { name: "A", value: 400 },
  { name: "B", value: 300 },
  { name: "C", value: 200 },
  { name: "D", value: 100 },
  { name: "E", value: 50 },
];

const Chart = () => {
  return (
    <Paper elevation={3} style={{ padding: 16 }}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3f51b5" />
      </BarChart>
    </Paper>
  );
};

export default Chart;
