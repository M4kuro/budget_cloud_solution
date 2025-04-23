import React from 'react';
import { TextField, MenuItem, Box } from '@mui/material';

export default function SearchBar({ searchTerm, onSearch, selectedCategory, onCategoryChange, categories }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 2 }}>
      <TextField
        label="Search by Name or ID"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
      <TextField
        select
        label="Category"
        variant="outlined"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        sx={{ minWidth: 200 }}
      >
        {['All', ...categories].map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
