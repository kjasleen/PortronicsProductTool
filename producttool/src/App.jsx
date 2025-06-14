import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Pages/Header';
import Dashboard from './Pages/Dashboard';
import ProductPage from './Components/NewProduct';
import Login from './Pages/Login';
import ProductPhases from './Pages/ProductPhases'; // ✅ Import added
import ProductReport from './Pages/ProductReport'; // ✅ Import added
import { useState, useEffect } from 'react';
import PrivateRoute from './Components/PrivateRoute';

const dummyOrders = [
  {
    orderId: "ORD001",
    productName: "Smart Watch",
    totalOrdered: 100,
    productionStarted: 50,
    productionCompleted: 20,
    shippingStarted: 10,
    shipped: 5,
    supplier: "XYZ Supplier",
    status: "Production Started"
  },
  // Add more dummy orders here
];
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            localStorage.getItem('token') ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <PrivateRoute>
              <ProductPhases />
            </PrivateRoute>
          }
        />
        <Route
          path="/report/:productId"
          element={
            <PrivateRoute>
              <ProductReport />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
