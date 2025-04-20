import React, { useEffect, useState } from 'react';
import './index.css'; // Import your CSS file for styling

export default function InventoryUI() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock data for testing
  const mockInventoryData = [
    { product_id: '1001', product_name: 'Wireless Headphones', category: 'Electronics', product_price: 89.99, stock_count: 42 },
    { product_id: '1002', product_name: 'Smart Watch', category: 'Electronics', product_price: 199.99, stock_count: 18 },
    { product_id: '1003', product_name: 'USB-C Cable', category: 'Accessories', product_price: 12.99, stock_count: 156 },
    { product_id: '1004', product_name: 'Bluetooth Speaker', category: 'Electronics', product_price: 59.99, stock_count: 7 },
    { product_id: '1005', product_name: 'Laptop Stand', category: 'Office', product_price: 24.95, stock_count: 23 },
    { product_id: '1006', product_name: 'Mechanical Keyboard', category: 'Computers', product_price: 129.99, stock_count: 5 },
    { product_id: '1007', product_name: 'Wireless Mouse', category: 'Computers', product_price: 45.00, stock_count: 34 },
    { product_id: '1008', product_name: 'Monitor', category: 'Computers', product_price: 299.99, stock_count: 12 },
    { product_id: '1009', product_name: 'HDMI Cable', category: 'Accessories', product_price: 8.99, stock_count: 89 },
    { product_id: '1010', product_name: 'External SSD', category: 'Storage', product_price: 149.99, stock_count: 15 },
    { product_id: '1011', product_name: 'Desk Chair', category: 'Office', product_price: 189.95, stock_count: 3 },
    { product_id: '1012', product_name: 'Webcam', category: 'Electronics', product_price: 69.99, stock_count: 28 },
  ];

  // Replace with your actual S3 bucket file URL when ready to use real data
  const summaryURL = 'https://YOUR_BUCKET.s3.amazonaws.com/latest_summary.json';
  
  // Use mock data or fetch from API
  useEffect(() => {
    // For development/demo, use mock data
    setInventory(mockInventoryData);
    setLoading(false);
    
    // When ready to use real data, uncomment this:
    /*
    fetch(summaryURL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setInventory(data.full_inventory || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading inventory:', err);
        setError('Failed to load inventory data. Please check the file URL and format.');
        setLoading(false);
      });
    */
  }, []);

  // Get unique categories from inventory
  const categories = ['All', ...new Set(inventory.map(item => item.category || 'Uncategorized'))];

  // Sort handler
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted and filtered items
  const getSortedItems = () => {
    let filteredItems = [...inventory];
    
    // Filter by search term
    if (searchTerm) {
      filteredItems = filteredItems.filter(item => 
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product_id.toString().includes(searchTerm)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filteredItems = filteredItems.filter(item => 
        (item.category || 'Uncategorized') === selectedCategory
      );
    }
    
    // Sort items
    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredItems;
  };

  // Low stock threshold
  const LOW_STOCK_THRESHOLD = 10;
  
  // Calculate statistics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.stock_count <= LOW_STOCK_THRESHOLD).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.product_price * item.stock_count), 0);

  // Get sorted and filtered inventory
  const displayItems = getSortedItems();

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inventory Management Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading inventory data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded shadow">
              <h3 className="text-lg font-medium text-blue-800">Total Products</h3>
              <p className="text-3xl font-bold">{totalItems}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded shadow">
              <h3 className="text-lg font-medium text-amber-800">Low Stock Items</h3>
              <p className="text-3xl font-bold">{lowStockItems}</p>
            </div>
            <div className="bg-green-50 p-4 rounded shadow">
              <h3 className="text-lg font-medium text-green-800">Total Inventory Value</h3>
              <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full p-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select 
                className="p-2 border rounded w-full md:w-auto"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th 
                    className="p-2 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('product_id')}
                  >
                    ID {sortConfig.key === 'product_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-2 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('product_name')}
                  >
                    Name {sortConfig.key === 'product_name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-2 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('category')}
                  >
                    Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-2 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('product_price')}
                  >
                    Price {sortConfig.key === 'product_price' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="p-2 border cursor-pointer hover:bg-gray-200"
                    onClick={() => requestSort('stock_count')}
                  >
                    Stock {sortConfig.key === 'stock_count' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 border">Value</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.length > 0 ? (
                  displayItems.map((item) => {
                    const isLowStock = item.stock_count <= LOW_STOCK_THRESHOLD;
                    const itemValue = item.product_price * item.stock_count;
                    
                    return (
                      <tr
                        key={item.product_id}
                        className={isLowStock ? 'bg-red-50' : ''}
                      >
                        <td className="p-2 border">{item.product_id}</td>
                        <td className="p-2 border font-medium">{item.product_name}</td>
                        <td className="p-2 border">{item.category || 'Uncategorized'}</td>
                        <td className="p-2 border">${item.product_price.toFixed(2)}</td>
                        <td className="p-2 border">
                          <div className="flex items-center">
                            <span className={`${isLowStock ? 'text-red-600 font-bold' : ''}`}>
                              {item.stock_count}
                            </span>
                            {item.stock_count > 0 && (
                              <div className="ml-2 bg-gray-200 w-24 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`}
                                  style={{ width: `${Math.min(100, (item.stock_count / 50) * 100)}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-2 border">${itemValue.toFixed(2)}</td>
                        <td className="p-2 border">
                          {isLowStock ? (
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                              Low Stock
                            </span>
                          ) : item.stock_count > 50 ? (
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                              Well Stocked
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No items match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary and Footer */}
          <div className="mt-6 text-sm text-gray-600">
            <p>Showing {displayItems.length} of {inventory.length} items</p>
            <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
          </div>
        </>
      )}
    </div>
  );
}