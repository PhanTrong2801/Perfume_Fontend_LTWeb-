import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State cho việc thanh toán
    const [showCheckout, setShowCheckout] = useState(false); // Hiện form thanh toán hay không
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD'); // Mặc định COD
    
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

    // ... (Giữ nguyên hàm fetchCart, handleRemove, handleUpdateQuantity như cũ) ...
    // ĐỂ TIẾT KIỆM KHÔNG GIAN, TÔI CHỈ VIẾT LẠI PHẦN MỚI, BẠN GIỮ CODE CŨ CỦA FETCH/REMOVE/UPDATE NHÉ

    const fetchCart = () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        axios.get(`${API_URL}/api/cart`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => { setCartItems(res.data.items || []); setLoading(false); })
        .catch(() => { setLoading(false); });
    };

    useEffect(() => { fetchCart(); }, []);

    const handleRemove = (itemId) => {
        const token = localStorage.getItem('token');
        if(!window.confirm("Xóa sản phẩm này?")) return;
        axios.delete(`${API_URL}/api/cart/remove/${itemId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => fetchCart());
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        if(newQuantity < 1) return;
        const token = localStorage.getItem('token');
        axios.put(`${API_URL}/api/cart/update/${itemId}`, { quantity: newQuantity }, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => fetchCart());
    };

    // --- HÀM XỬ LÝ THANH TOÁN (MỚI) ---
    const handleCheckout = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!address.trim()) {
            alert("Vui lòng nhập địa chỉ nhận hàng!");
            return;
        }

        const orderData = {
            shipping_address: address,
            payment_method: paymentMethod
        };

        axios.post(`${API_URL}/api/checkout`, orderData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            alert("Đặt hàng thành công! Mã đơn: #" + res.data.order_id);
            // Chuyển hướng sang trang theo dõi đơn hàng
            navigate('/orders');
        })
        .catch(err => {
            console.error(err);
            alert("Đặt hàng thất bại. Vui lòng thử lại.");
        });
    };

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((total, item) => {
        return total + (Number(item.variant.price) * item.quantity);
    }, 0);

    if (loading) return <div className="text-center mt-5">Đang tải...</div>;
    if (cartItems.length === 0) return <div className="text-center mt-5"><h3>Giỏ hàng trống</h3><Link to="/" className="btn btn-primary">Mua ngay</Link></div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Giỏ hàng của bạn</h2>
            <div className="row">
                {/* Cột Danh sách sản phẩm (Giữ nguyên giao diện cũ) */}
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            {cartItems.map(item => (
                                <div key={item.cart_item_id} className="row border-bottom py-3 align-items-center">
                                    <div className="col-2"><img src={item.variant.product.thumbnail} className="img-fluid rounded" /></div>
                                    <div className="col-4">
                                        <h5>{item.variant.product.product_name}</h5>
                                        <p className="text-muted small">Dung tích: {item.variant.volume}</p>
                                    </div>
                                    <div className="col-3 text-center">
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}>-</button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}>+</button>
                                    </div>
                                    <div className="col-2 fw-bold">{(Number(item.variant.price) * item.quantity).toLocaleString()} đ</div>
                                    <div className="col-1"><button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.cart_item_id)}>X</button></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cột Thanh toán (Cập nhật Mới) */}
                <div className="col-md-4">
                    <div className="card shadow-sm mb-3">
                        <div className="card-header bg-white fw-bold">Tổng quan đơn hàng</div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                                <span>Tổng cộng:</span>
                                <span className="h5 text-danger">{totalPrice.toLocaleString()} đ</span>
                            </div>
                            
                            {!showCheckout ? (
                                <button className="btn btn-dark w-100 py-2" onClick={() => setShowCheckout(true)}>
                                    TIẾN HÀNH THANH TOÁN
                                </button>
                            ) : (
                                // Form Nhập địa chỉ hiện ra khi bấm nút
                                <form onSubmit={handleCheckout}>
                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ nhận hàng:</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="3" 
                                            placeholder="Số nhà, đường, phường, quận..."
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Phương thức thanh toán:</label>
                                        <select 
                                            className="form-select"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                                            <option value="BANKING">Chuyển khoản ngân hàng</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-success w-100 mb-2">Xác nhận đặt hàng</button>
                                    <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setShowCheckout(false)}>Hủy</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;