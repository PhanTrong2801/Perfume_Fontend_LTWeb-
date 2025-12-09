import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [products, setProducts] = useState([]); // Chứa danh sách sản phẩm
    const [loading, setLoading] = useState(true);
    const API_URL =import.meta.env.VITE_API_URL; 

    // Gọi API khi component được mount
    useEffect(() => {
        axios.get(`${API_URL}/api/products`)
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi gọi API:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center mt-5">Đang tải sản phẩm...</div>;

    return (
        <div>
            {/* Banner */}
            <div className="bg-dark text-white text-center py-5 mb-5">
                <div className="container">
                    <h1 className="display-4">Thế giới Nước hoa</h1>
                    <p className="lead">Hương thơm khẳng định đẳng cấp</p>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="container">
                <h2 className="text-center mb-4">Sản phẩm mới nhất</h2>
                <div className="row">
                    {products.map(product => {
                        // Logic lấy giá: Lấy giá của biến thể đầu tiên (thường là dung tích nhỏ nhất)
                        const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
                        const price = firstVariant ? Number(firstVariant.price).toLocaleString('vi-VN') : "Liên hệ";

                        return (
                            <div key={product.product_id} className="col-md-3 mb-4">
                                <div className="card h-100 shadow-sm">
                                    <img 
                                        src={product.thumbnail} 
                                        className="card-img-top" 
                                        alt={product.product_name}
                                        style={{ height: '250px', objectFit: 'cover' }} 
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title" style={{fontSize: '1.1rem'}}>{product.product_name}</h5>
                                        <p className="text-muted small mb-1">{product.brand?.brand_name}</p>
                                        
                                        <div className="mt-auto">
                                            <p className="text-danger fw-bold mb-2">Giá từ: {price} đ</p>
                                            <Link to={`/product/${product.product_id}`} className="btn btn-outline-dark w-100">
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HomePage;