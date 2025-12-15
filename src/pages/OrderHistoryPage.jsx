import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`${API_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setOrders(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    // Hàm tô màu trạng thái
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <span className="badge bg-warning text-dark">Chờ xử lý</span>;
            case 'Processing': return <span className="badge bg-primary">Đang đóng gói</span>;
            case 'Shipped': return <span className="badge bg-info">Đang giao</span>;
            case 'Delivered': return <span className="badge bg-success">Đã giao</span>;
            case 'Cancelled': return <span className="badge bg-danger">Đã hủy</span>;
            default: return <span className="badge bg-secondary">{status}</span>;
        }
    };

    if (loading) return <div className="text-center mt-5">Đang tải đơn hàng...</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Lịch sử đơn hàng của tôi</h2>
            
            {orders.length === 0 ? (
                <div className="alert alert-info">Bạn chưa có đơn hàng nào. <Link to="/">Mua sắm ngay</Link></div>
            ) : (
                <div className="row">
                    {orders.map(order => (
                        <div key={order.order_id} className="col-12 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                                    <div>
                                        <strong>Đơn hàng #{order.order_id}</strong>
                                        <span className="text-muted ms-3 small">
                                            {new Date(order.created_at).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <div>{getStatusBadge(order.status)}</div>
                                </div>
                                <div className="card-body">
                                    {/* Danh sách sản phẩm trong đơn */}
                                    {order.items.map(item => (
                                        <div key={item.item_id} className="d-flex align-items-center mb-2 border-bottom pb-2">
                                            <img 
                                                src={item.variant.product.thumbnail} 
                                                width="50" height="50" 
                                                className="rounded me-3" 
                                                style={{objectFit: 'cover'}}
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-0">{item.variant.product.product_name}</h6>
                                                <small className="text-muted">
                                                    {item.variant.volume} x {item.quantity}
                                                </small>
                                            </div>
                                            <div className="fw-bold">
                                                {Number(item.unit_price).toLocaleString()} đ
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="d-flex justify-content-between mt-3 pt-2">
                                        <div>
                                            <small className="text-muted d-block">Địa chỉ: {order.shipping_address}</small>
                                            <small className="text-muted">Thanh toán: {order.payment_method}</small>
                                        </div>
                                        <h5 className="text-danger mb-0 align-self-end">
                                            Tổng: {Number(order.total_amount).toLocaleString()} đ
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistoryPage;