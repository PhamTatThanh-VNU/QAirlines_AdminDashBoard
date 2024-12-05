import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function Dashboard() {
  const stats = [
    { label: "Total Flights", value: 120 },
    { label: "Total Customers", value: 3000 },
    { label: "Revenue", value: "$1.2M" },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={4} key={stat.label}>
          <Card>
            <CardContent>
              <Typography variant="h5">{stat.label}</Typography>
              <Typography variant="h6">{stat.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
