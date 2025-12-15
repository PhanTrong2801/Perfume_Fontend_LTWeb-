import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'; // Fallback nếu quên set env

    // 1. State lưu dữ liệu
    const [products, setProducts] = useState([]);           // Dữ liệu gốc server trả về
    const [filteredProducts, setFilteredProducts] = useState([]); // Dữ liệu hiển thị (sau khi lọc)
    const [loading, setLoading] = useState(true);

    // 2. State cho bộ lọc & tìm kiếm
    const [filterGender, setFilterGender] = useState('ALL'); // ALL, Male, Female, Unisex
    const [searchTerm, setSearchTerm] = useState('');

    // 3. Gọi API khi component mount
    useEffect(() => {
        axios.get(`${API_URL}/api/products`)
            .then(response => {
                setProducts(response.data);
                setFilteredProducts(response.data); // Ban đầu hiển thị tất cả
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi gọi API:", error);
                setLoading(false);
            });
    }, [API_URL]);

    // 4. Logic Lọc sản phẩm (Chạy mỗi khi search hoặc chọn giới tính)
    useEffect(() => {
        let result = products;

        // Lọc theo giới tính (Nếu không phải ALL)
        if (filterGender !== 'ALL') {
            result = result.filter(product => product.gender === filterGender);
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(product => 
                product.product_name.toLowerCase().includes(lowerTerm) ||
                product.brand?.brand_name.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredProducts(result);
    }, [filterGender, searchTerm, products]);

    // Hàm format giá tiền
    const getPriceDisplay = (variants) => {
        if (!variants || variants.length === 0) return "Liên hệ";
        // Lấy giá thấp nhất
        const minPrice = Math.min(...variants.map(v => Number(v.price)));
        return minPrice.toLocaleString('vi-VN') + ' đ';
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}>
            <div className="spinner-border text-primary" role="status"></div>
            <span className="ms-2">Đang tải sản phẩm...</span>
        </div>
    );

    return (
        <div>
            {/* --- 1. BANNER (HERO SECTION) --- */}
            <div className="bg-dark text-white text-center py-5 mb-5" 
                 style={{
                     backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2070")',
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     minHeight: '400px',
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center'
                 }}>
                <div className="container">
                    <h1 className="display-3 fw-bold">Thế giới Nước hoa</h1>
                    <p className="lead fs-4">Đánh thức mọi giác quan với bộ sưu tập mùi hương đẳng cấp.</p>
                    <a href="#product-list" className="btn btn-outline-light btn-lg mt-3 px-5">Khám phá ngay</a>
                </div>
            </div>

            <div className="container" id="product-list">
                {/* --- 2. THANH CÔNG CỤ (LỌC & TÌM KIẾM) --- */}
                <div className="row mb-5 align-items-center">
                    {/* Bộ lọc giới tính */}
                    <div className="col-md-7 mb-3 mb-md-0 d-flex gap-2 flex-wrap">
                        {['ALL', 'Male', 'Female', 'Unisex'].map(gender => (
                            <button 
                                key={gender}
                                className={`btn ${filterGender === gender ? 'btn-dark' : 'btn-outline-secondary'}`}
                                onClick={() => setFilterGender(gender)}
                            >
                                {gender === 'ALL' ? 'Tất cả' : 
                                 gender === 'Male' ? 'Nam' : 
                                 gender === 'Female' ? 'Nữ' : 'Unisex'}
                            </button>
                        ))}
                    </div>

                    {/* Ô tìm kiếm */}
                    <div className="col-md-5">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-search"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-start-0" 
                                placeholder="Tìm tên nước hoa, thương hiệu..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* --- 3. DANH SÁCH SẢN PHẨM --- */}
                <div className="row">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => {
                            return (
                                <div key={product.product_id} className="col-md-3 col-sm-6 mb-4">
                                    <div className="card h-100 border-0 shadow-sm product-card">
                                        <div className="position-relative overflow-hidden p-3 bg-light text-center" style={{height: '280px'}}>
                                            <img 
                                                src={product.thumbnail} 
                                                className="card-img-top h-100 w-auto" 
                                                alt={product.product_name}
                                                style={{objectFit: 'contain', mixBlendMode: 'multiply'}} 
                                            />
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <p className="text-muted small mb-1 text-uppercase fw-bold">
                                                {product.brand?.brand_name}
                                            </p>
                                            <h5 className="card-title text-truncate" title={product.product_name}>
                                                <Link to={`/product/${product.product_id}`} className="text-decoration-none text-dark">
                                                    {product.product_name}
                                                </Link>
                                            </h5>
                                            
                                            <div className="mt-auto pt-3">
                                                <p className="text-danger fw-bold fs-5 mb-2">
                                                    {getPriceDisplay(product.variants)}
                                                </p>
                                                <Link to={`/product/${product.product_id}`} className="btn btn-dark w-100">
                                                    Xem chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center py-5">
                            <h4 className="text-muted">Không tìm thấy sản phẩm nào phù hợp.</h4>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="py-5"></div>
        </div>
    );
};

export default HomePage;