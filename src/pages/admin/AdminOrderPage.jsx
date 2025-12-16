import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

    // Hàm lấy danh sách đơn
    const fetchOrders = () => {
        const token = localStorage.getItem('token');
        axios.get(`${API_URL}/api/admin/orders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setOrders(res.data))
        .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Hàm cập nhật trạng thái
    const handleStatusChange = (orderId, newStatus) => {
        const token = localStorage.getItem('token');
        if(!window.confirm(`Đổi trạng thái đơn hàng #${orderId} thành ${newStatus}?`)) return;

        axios.put(`${API_URL}/api/admin/orders/${orderId}/status`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
            alert("Cập nhật thành công!");
            fetchOrders(); 
        })
        .catch(() => alert("Lỗi cập nhật!"));
    };

    // Hàm hiển thị màu trạng thái
    const getStatusColor = (status) => {
        switch(status) {
            case 'Pending': return 'bg-warning text-dark';
            case 'Processing': return 'bg-primary';
            case 'Shipped': return 'bg-info';
            case 'Delivered': return 'bg-success';
            case 'Cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div>
            <h2 className="mb-4">Quản lý Đơn hàng</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.order_id}>
                                <td>#{order.order_id}</td>
                                <td>
                                    <strong>{order.user?.full_name || order.user?.username}</strong><br/>
                                    <small className="text-muted">{order.shipping_address}</small>
                                </td>
                                <td>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                                <td className="fw-bold text-danger">
                                    {Number(order.total_amount).toLocaleString()} đ
                                </td>
                                <td>
                                    <span className={`badge ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        className="form-select form-select-sm"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                        disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                                    >
                                        <option value="Pending">Chờ xử lý</option>
                                        <option value="Processing">Đóng gói</option>
                                        <option value="Shipped">Đang giao</option>
                                        <option value="Delivered">Đã giao</option>
                                        <option value="Cancelled">Hủy đơn</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminOrderPage;