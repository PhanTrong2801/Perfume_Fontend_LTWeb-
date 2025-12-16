import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const HomePage = () => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

    // State dữ liệu
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // State bộ lọc & tìm kiếm
    const [filterGender, setFilterGender] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    // State Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

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
        setCurrentPage(1);
    }, [filterGender, searchTerm, products]);

    // Phân trang
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Format giá
    const getPriceDisplay = (variants) => {
        if (!variants || variants.length === 0) return "Liên hệ";
        const minPrice = Math.min(...variants.map(v => Number(v.price)));
        return minPrice.toLocaleString('vi-VN') + ' đ';
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
            <div className="spinner-border text-dark" role="status" style={{width: '3rem', height: '3rem'}}></div>
        </div>
    );

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="flex-grow-1">
                
                {/* --- 1. HERO CAROUSEL (SLIDER) --- */}
                <div id="heroCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
                        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
                        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
                    </div>
                    <div className="carousel-inner">
                        {/* Slide 1 */}
                        <div className="carousel-item active" data-bs-interval="3000" style={{height: '500px'}}>
                            <img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2070" className="d-block w-100 h-100" style={{objectFit: 'cover', filter: 'brightness(0.7)'}} alt="..." />
                            <div className="carousel-caption d-none d-md-block text-start" style={{top: '30%', left: '10%'}}>
                                <h1 className="display-3 fw-bold text-uppercase">Đẳng cấp mùi hương</h1>
                                <p className="lead fs-4">Khám phá bộ sưu tập nước hoa sang trọng từ những thương hiệu hàng đầu.</p>
                                <a href="#product-list" className="btn btn-light btn-lg px-5 mt-3 fw-bold rounded-0">MUA NGAY</a>
                            </div>
                        </div>
                        {/* Slide 2 */}
                        <div className="carousel-item" data-bs-interval="3000" style={{height: '500px'}}>
                            <img src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=2070" className="d-block w-100 h-100" style={{objectFit: 'cover', filter: 'brightness(0.6)'}} alt="..." />
                            <div className="carousel-caption d-none d-md-block" style={{top: '35%'}}>
                                <h2 className="display-4 fw-bold">Dành cho Phái Mạnh</h2>
                                <p className="fs-5">Mạnh mẽ, lôi cuốn và đầy bản lĩnh.</p>
                                <button className="btn btn-outline-light btn-lg px-4 rounded-0" onClick={() => setFilterGender('Male')}>Xem BST Nam</button>
                            </div>
                        </div>
                        {/* Slide 3 */}
                        <div className="carousel-item" data-bs-interval="3000" style={{height: '500px'}}>
                            <img src="https://images.unsplash.com/photo-1595867355202-e2233ce93282?q=80&w=2070" className="d-block w-100 h-100" style={{objectFit: 'cover', filter: 'brightness(0.7)'}} alt="..." />
                            <div className="carousel-caption d-none d-md-block text-end" style={{top: '30%', right: '10%'}}>
                                <h2 className="display-4 fw-bold">Quyến rũ & Tinh tế</h2>
                                <p className="fs-5">Những nốt hương ngọt ngào dành riêng cho nàng.</p>
                                <button className="btn btn-outline-light btn-lg px-4 rounded-0" onClick={() => setFilterGender('Female')}>Xem BST Nữ</button>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div>

                {/* --- 2. SERVICE FEATURES (LÝ DO MUA HÀNG) --- */}
                <div className="container mb-5">
                    <div className="row text-center g-4">
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100">
                                <i className="bi bi-patch-check-fill text-dark display-4 mb-3"></i>
                                <h5 className="fw-bold">100% Chính Hãng</h5>
                                <p className="text-muted small mb-0">Cam kết hoàn tiền gấp đôi nếu phát hiện hàng giả, hàng nhái.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100">
                                <i className="bi bi-truck text-dark display-4 mb-3"></i>
                                <h5 className="fw-bold">Giao Hàng Miễn Phí</h5>
                                <p className="text-muted small mb-0">Freeship toàn quốc cho đơn hàng từ 1.000.000đ.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100">
                                <i className="bi bi-headset text-dark display-4 mb-3"></i>
                                <h5 className="fw-bold">Hỗ Trợ 24/7</h5>
                                <p className="text-muted small mb-0">Đội ngũ tư vấn chuyên nghiệp, am hiểu về mùi hương.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 3. PROMO BANNER --- */}
                <div className="container-fluid bg-light py-5 mb-5">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6 mb-4 mb-md-0">
                                <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1904" className="img-fluid rounded shadow" alt="Perfume" />
                            </div>
                            <div className="col-md-6 ps-md-5">
                                <span className="text-danger fw-bold text-uppercase ls-2">Khuyến mãi đặc biệt</span>
                                <h2 className="display-5 fw-bold mt-2 mb-4">Bộ Sưu Tập Mùa Hè</h2>
                                <p className="lead text-muted mb-4">Trải nghiệm sự tươi mát bất tận với những nốt hương cam chanh và biển cả. Giảm giá lên đến 20% cho các dòng sản phẩm Summer Vibes.</p>
                                <a href="#product-list" className="btn btn-dark btn-lg rounded-0 px-4">Xem Chi Tiết</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- KHU VỰC SẢN PHẨM CHÍNH --- */}
                <div className="container" id="product-list">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-uppercase">Sản Phẩm Mới Nhất</h2>
                        <div className="mx-auto bg-dark" style={{width: '60px', height: '3px'}}></div>
                    </div>

                    {/* THANH CÔNG CỤ */}
                    <div className="row mb-4 align-items-center bg-white p-3 rounded shadow-sm border mx-1">
                        <div className="col-md-7 mb-3 mb-md-0 d-flex gap-2 flex-wrap">
                            {['ALL', 'Male', 'Female', 'Unisex'].map(gender => (
                                <button 
                                    key={gender}
                                    className={`btn ${filterGender === gender ? 'btn-dark' : 'btn-outline-secondary'} rounded-pill px-4`}
                                    onClick={() => setFilterGender(gender)}
                                >
                                    {gender === 'ALL' ? 'Tất cả' : gender === 'Male' ? 'Nam' : gender === 'Female' ? 'Nữ' : 'Unisex'}
                                </button>
                            ))}
                        </div>
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0 ps-0" 
                                    placeholder="Tìm tên nước hoa, thương hiệu..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* DANH SÁCH SẢN PHẨM */}
                    <div className="row">
                        {currentProducts.length > 0 ? (
                            currentProducts.map(product => (
                                <div key={product.product_id} className="col-md-3 col-sm-6 mb-4">
                                    <div className="card h-100 border-0 shadow-hover product-card">
                                        <div className="position-relative overflow-hidden bg-white text-center p-4" style={{height: '300px'}}>
                                            {/* Badge Mới */}
                                            <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small m-2 rounded">NEW</span>
                                            
                                            <img 
                                                src={product.thumbnail} 
                                                className="card-img-top h-100 w-auto" 
                                                alt={product.product_name}
                                                style={{objectFit: 'contain', mixBlendMode: 'multiply'}} 
                                            />
                                        </div>
                                        <div className="card-body d-flex flex-column text-center">
                                            <p className="text-muted small mb-1 text-uppercase fw-bold ls-1">{product.brand?.brand_name}</p>
                                            <h5 className="card-title text-truncate fw-bold mb-3" title={product.product_name}>
                                                <Link to={`/product/${product.product_id}`} className="text-decoration-none text-dark stretched-link">
                                                    {product.product_name}
                                                </Link>
                                            </h5>
                                            <div className="mt-auto">
                                                <p className="text-dark fw-bold fs-5 mb-0">{getPriceDisplay(product.variants)}</p>
                                            </div>
                                        </div>
                                        <div className="card-footer bg-white border-0 pb-3">
                                            <Link to={`/product/${product.product_id}`} className="btn btn-outline-dark w-100 rounded-0">Xem Chi Tiết</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <i className="bi bi-box-seam display-1 text-muted"></i>
                                <h4 className="text-muted mt-3">Không tìm thấy sản phẩm nào.</h4>
                            </div>
                        )}
                    </div>

                    {/* PHÂN TRANG */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4 mb-5">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link text-dark border-0" onClick={() => paginate(currentPage - 1)}>&laquo;</button>
                                    </li>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button 
                                                className={`page-link border-0 ${currentPage === index + 1 ? 'bg-dark text-white rounded-circle mx-1' : 'text-dark'}`}
                                                onClick={() => paginate(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link text-dark border-0" onClick={() => paginate(currentPage + 1)}>&raquo;</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HomePage;