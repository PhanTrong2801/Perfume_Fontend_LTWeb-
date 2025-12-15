import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminProductList() {
    const [products, setProducts] = useState([]);
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

    const fetchProducts = () => {
        const token = localStorage.getItem('token');
        axios.get(`${API_URL}/api/admin/products`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setProducts(res.data))
        .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = (id) => {
        if(!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
        const token = localStorage.getItem('token');
        axios.delete(`${API_URL}/api/admin/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("Đã xóa!");
            fetchProducts();
        })
        .catch(() => alert("Lỗi khi xóa!"));
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quản lý Sản phẩm</h2>
                <Link to="/admin/products/new" className="btn btn-success">
                    <i className="bi bi-plus-lg"></i> Thêm mới
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Thương hiệu</th>
                            <th>Danh mục</th>
                            <th>Biến thể (Giá)</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.product_id}>
                                <td>{p.product_id}</td>
                                <td>
                                    <img src={p.thumbnail} width="50" height="50" style={{objectFit:'contain'}} alt="" />
                                </td>
                                <td style={{maxWidth: '200px'}}>{p.product_name}</td>
                                <td>{p.brand?.brand_name}</td>
                                <td>{p.category?.category_name}</td>
                                <td>
                                    {p.variants.map(v => (
                                        <div key={v.variant_id} className="small">
                                            <span className="fw-bold">{v.volume}:</span> {Number(v.price).toLocaleString()}đ
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <Link to={`/admin/products/edit/${p.product_id}`} className="btn btn-sm btn-primary me-2">
                                        <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.product_id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminProductList;