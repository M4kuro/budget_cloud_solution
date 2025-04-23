import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, LinearProgress, Chip
} from '@mui/material';

// Sample/mock data keys match table property names: product_price and stock_count
const inventory = [
  { id: '101', name: 'Headphones', category: 'Electronics', product_price: 89.99, stock_count: 42 },
  { id: '102', name: 'Webcam', category: 'Accessories', product_price: 59.99, stock_count: 5 },
  { id: '103', name: 'Keyboard', category: 'Office', product_price: 120.00, stock_count: 17 },
];

const LOW_STOCK_THRESHOLD = 10;

export default function InventoryTable() {
  return (
    <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>Inventory Table</Typography>
      <Table>
        <TableHead sx={{ bgcolor: 'grey.100' }}>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Stock</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map((item) => {
            const stock = item.stock_count;
            const price = item.product_price;
            const isLowStock = stock <= LOW_STOCK_THRESHOLD;
            const barColor = isLowStock ? 'error' : stock > 50 ? 'success' : 'primary';
            const statusLabel = isLowStock ? 'Low Stock' : stock > 50 ? 'Well Stocked' : 'In Stock';
            const statusColor = isLowStock ? 'error' : stock > 50 ? 'success' : 'info';

            return (
              <TableRow
                key={item.id}
                sx={{ bgcolor: isLowStock ? 'error.lighter' : 'inherit' }}
              >
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>${price.toFixed(2)}</TableCell>
                <TableCell>
                  <Typography fontWeight="bold" color={isLowStock ? 'error.main' : 'text.primary'}>
                    {stock}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (stock / 50) * 100)}
                    color={barColor}
                    sx={{ height: 6, borderRadius: 2, mt: 0.5 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabel}
                    color={statusColor}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}