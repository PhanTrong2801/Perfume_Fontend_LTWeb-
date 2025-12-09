import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    // Hàm lấy dữ liệu giỏ hàng
    const fetchCart = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get(`${API_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            // API trả về object Cart, trong đó có mảng items
            setCartItems(res.data.items || []); 
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Xử lý Xóa
    const handleRemove = (itemId) => {
        if(!window.confirm("Bạn chắc chắn muốn xóa?")) return;
        
        const token = localStorage.getItem('token');
        axios.delete(`${API_URL}/api/cart/remove/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            fetchCart(); // Load lại giỏ hàng sau khi xóa
        })
        .catch(() => alert("Lỗi khi xóa!"));
    };

    // Xử lý Cập nhật số lượng
    const handleUpdateQuantity = (itemId, newQuantity) => {
        if(newQuantity < 1) return;

        const token = localStorage.getItem('token');
        axios.put(`${API_URL}/api/cart/update/${itemId}`, 
            { quantity: newQuantity },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
            // Cập nhật giao diện ngay lập tức (Optimistic Update) hoặc gọi lại API
            fetchCart(); 
        })
        .catch(err => console.error(err));
    };

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((total, item) => {
        return total + (Number(item.variant.price) * item.quantity);
    }, 0);

    if (loading) return <div className="text-center mt-5">Đang tải giỏ hàng...</div>;

    if (cartItems.length === 0) {
        return (
            <div className="container text-center mt-5">
                <h3>Giỏ hàng của bạn đang trống</h3>
                <Link to="/" className="btn btn-primary mt-3">Tiếp tục mua sắm</Link>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Giỏ hàng của bạn</h2>
            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            {cartItems.map(item => (
                                <div key={item.cart_item_id} className="row border-bottom py-3 align-items-center">
                                    <div className="col-2">
                                        <img 
                                            src={item.variant.product.thumbnail} 
                                            className="img-fluid rounded" 
                                            alt={item.variant.product.product_name}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <h5 className="mb-1">
                                            <Link to={`/product/${item.variant.product.product_id}`} className="text-decoration-none text-dark">
                                                {item.variant.product.product_name}
                                            </Link>
                                        </h5>
                                        <p className="text-muted mb-0 small">Phân loại: {item.variant.volume}</p>
                                    </div>
                                    <div className="col-3 text-center">
                                        <div className="input-group input-group-sm w-75 mx-auto">
                                            <button className="btn btn-outline-secondary" onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}>-</button>
                                            <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                                            <button className="btn btn-outline-secondary" onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className="col-2 text-end fw-bold">
                                        {(Number(item.variant.price) * item.quantity).toLocaleString()} đ
                                    </div>
                                    <div className="col-1 text-end">
                                        <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.cart_item_id)}>
                                            <i className="bi bi-trash"></i> Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cột Tổng tiền */}
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white fw-bold">Tóm tắt đơn hàng</div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                                <span>Tạm tính:</span>
                                <span className="fw-bold">{totalPrice.toLocaleString()} đ</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Phí vận chuyển:</span>
                                <span className="text-success">Miễn phí</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-4">
                                <span className="h5">Tổng cộng:</span>
                                <span className="h5 text-danger">{totalPrice.toLocaleString()} đ</span>
                            </div>
                            <button className="btn btn-dark w-100 py-2">
                                TIẾN HÀNH THANH TOÁN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;