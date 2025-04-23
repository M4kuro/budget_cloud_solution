import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const stats = [
  { label: 'Total Products', value: 128 },
  { label: 'Low Stock Items', value: 7 },
  { label: 'Total Inventory Value', value: '$25,492.00' },
];

export default function SummaryCards() {
  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary">
              {stat.label}
            </Typography>
            <Typography variant="h4">{stat.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
