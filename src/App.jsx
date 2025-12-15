import React, { useState } from 'react'; // Bỏ useEffect vì không cần dùng nữa
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminLayout from './components/AdminLayout.jsx';

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
          try {
              return JSON.parse(userInfo);
          } catch (error) {
              console.error("Lỗi đọc user:", error); 
              return null;
          }
      }
      return null;
  });

  const isAdminRoute = location.pathname.startsWith('/admin');

  // XÓA HẾT ĐOẠN useEffect(...) CŨ ĐI NHÉ

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    setUser(null);
    navigate('/login');
  };

  

  return (
    <>
      {!isAdminRoute && (
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">PERFUME STORE</Link>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">Trang chủ</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Giỏ hàng</Link>
              </li>
              
              <li className="nav-item">
                  <Link className="nav-link" to="/orders">Đơn mua</Link>
              </li>

              {user ? (
                <li className="nav-item ms-3 d-flex align-items-center gap-2">
                  <span className="fw-bold text-dark">
                    Chào, {user.full_name || user.username}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-danger btn-sm"
                  >
                    Đăng xuất
                  </button>
                </li>
              ) : (
                <li className="nav-item ms-3">
                  <Link className="btn btn-primary btn-sm text-white px-3" to="/login">
                    Đăng nhập
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
        )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />


        <Route path="/admin" element={<AdminLayout />}>
            <Route path="orders" element={<AdminOrderPage />} />
        </Route>

      </Routes>
      
    </>
  );
}

export default App;