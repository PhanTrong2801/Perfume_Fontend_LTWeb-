import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    // Kiểm tra quyền Admin khi vào trang
    useEffect(() => {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            if (parsedUser.role !== 'admin') {
                alert("Bạn không có quyền truy cập trang này!");
                navigate('/');
            } else {
                setUser(parsedUser);
            }
        } else {
            navigate('/login');
        }
    }, []);

    // 3. Hàm tạo class động: Nếu URL chứa path thì active
    const getLinkClass = (path) => {
        const baseClass = "nav-link text-white";
        const activeClass = "bg-primary bg-opacity-50 rounded shadow-sm fw-bold";

        return location.pathname.includes(path) ? `${baseClass} ${activeClass}` : baseClass;
    };

    if (!user) return null;

    return (
        <div className="d-flex min-vh-100">
            <div className="bg-dark text-white p-3" style={{width: '250px', minHeight: '100vh'}}>
                <h4 className="mb-4 text-warning fw-bold">ADMIN PANEL</h4>
                <ul className="nav flex-column gap-2">
                    
                    <li className="nav-item">
                        <Link 
                            to="/admin/orders" 
                            className={getLinkClass('/admin/orders')} 
                        >
                            <i className="bi bi-receipt me-2"></i> Quản lý Đơn hàng
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link 
                            to="/admin/products" 
                            className={getLinkClass('/admin/products')} 
                        >
                            <i className="bi bi-box-seam me-2"></i> Quản lý Sản phẩm
                        </Link>
                    </li>

                    <li className="nav-item mt-5">
                        <Link to="/" className="nav-link text-danger">
                            <i className="bi bi-box-arrow-left me-2"></i> Về trang chủ
                        </Link>
                    </li>
                </ul>
            </div>


            <div className="flex-grow-1 bg-light p-4">
                <div className="bg-white p-4 rounded shadow-sm">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;