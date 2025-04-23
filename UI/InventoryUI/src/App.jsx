import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import InventoryTable from './components/InventoryTable';
import SearchBar from './components/SearchBar';


function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mockCategories, setMockCategories] = useState([]);
  const [mockData, setMockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
return (
    <div>
    <Header />
    <StatsCards />
    <SearchBar
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={mockCategories}
    />
    <InventoryTable />
    </div>
  )
}

export default App
