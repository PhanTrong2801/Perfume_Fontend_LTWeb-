import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'; // Import Footer vừa tạo

const HomePage = () => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

    // State dữ liệu
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // State bộ lọc & tìm kiếm
    const [filterGender, setFilterGender] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    // --- State Phân trang (Pagination) ---
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; // Số sản phẩm trên 1 trang (4 cột x 2 hàng)

    // Gọi API
    useEffect(() => {
        axios.get(`${API_URL}/api/products`)
            .then(response => {
                setProducts(response.data);
                setFilteredProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi gọi API:", error);
                setLoading(false);
            });
    }, [API_URL]);

    // Logic Lọc & Tìm kiếm
    useEffect(() => {
        let result = products;

        if (filterGender !== 'ALL') {
            result = result.filter(product => product.gender === filterGender);
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(product => 
                product.product_name.toLowerCase().includes(lowerTerm) ||
                product.brand?.brand_name.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset về trang 1 mỗi khi lọc/tìm kiếm
    }, [filterGender, searchTerm, products]);

    // --- LOGIC TÍNH TOÁN PHÂN TRANG ---
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Format giá
    const getPriceDisplay = (variants) => {
        if (!variants || variants.length === 0) return "Liên hệ";
        const minPrice = Math.min(...variants.map(v => Number(v.price)));
        return minPrice.toLocaleString('vi-VN') + ' đ';
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Wrapper để đẩy Footer xuống đáy nếu nội dung ngắn */}
            <div className="flex-grow-1">
                
                {/* BANNER */}
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
                    {/* THANH CÔNG CỤ */}
                    <div className="row mb-5 align-items-center">
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

                    {/* DANH SÁCH SẢN PHẨM (Đã phân trang) */}
                    <div className="row">
                        {currentProducts.length > 0 ? (
                            currentProducts.map(product => (
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
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <h4 className="text-muted">Không tìm thấy sản phẩm nào phù hợp.</h4>
                            </div>
                        )}
                    </div>

                    {/* --- THANH PHÂN TRANG (PAGINATION) --- */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4 mb-5">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link text-dark" onClick={() => paginate(currentPage - 1)}>
                                            <span aria-hidden="true">&laquo;</span>
                                        </button>
                                    </li>
                                    
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button 
                                                className={`page-link ${currentPage === index + 1 ? 'bg-dark border-dark text-white' : 'text-dark'}`}
                                                onClick={() => paginate(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link text-dark" onClick={() => paginate(currentPage + 1)}>
                                            <span aria-hidden="true">&raquo;</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}

                </div>
            </div>

            {/* --- FOOTER --- */}
            <Footer />
        </div>
    );
};

export default HomePage;