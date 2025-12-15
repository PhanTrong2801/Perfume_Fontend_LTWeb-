import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-4">
            <div className="container text-md-left">
                <div className="row text-center text-md-start">
                    
                    {/* Cột 1: Giới thiệu */}
                    <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Perfume Store</h5>
                        <p>
                            Nơi hội tụ những mùi hương đẳng cấp nhất thế giới. 
                            Cam kết hàng chính hãng 100%. Đánh thức mọi giác quan của bạn.
                        </p>
                    </div>

                    {/* Cột 2: Sản phẩm */}
                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Sản phẩm</h5>
                        <p><Link to="/" className="text-white text-decoration-none">Nước hoa Nam</Link></p>
                        <p><Link to="/" className="text-white text-decoration-none">Nước hoa Nữ</Link></p>
                        <p><Link to="/" className="text-white text-decoration-none">Unisex</Link></p>
                        <p><Link to="/" className="text-white text-decoration-none">Gift Set</Link></p>
                    </div>

                    {/* Cột 3: Hỗ trợ */}
                    <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Hỗ trợ</h5>
                        <p><a href="#" className="text-white text-decoration-none">Tài khoản</a></p>
                        <p><a href="#" className="text-white text-decoration-none">Chính sách vận chuyển</a></p>
                        <p><a href="#" className="text-white text-decoration-none">Đổi trả hàng</a></p>
                        <p><a href="#" className="text-white text-decoration-none">Trợ giúp</a></p>
                    </div>

                    {/* Cột 4: Liên hệ */}
                    <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                        <h5 className="text-uppercase mb-4 font-weight-bold text-warning">Liên hệ</h5>
                        <p><i className="bi bi-house-door me-2"></i> Quận 1, TP. Hồ Chí Minh</p>
                        <p><i className="bi bi-envelope me-2"></i> contact@perfumestore.vn</p>
                        <p><i className="bi bi-phone me-2"></i> +84 123 456 789</p>
                    </div>
                </div>

                <hr className="mb-4" />

                <div className="row align-items-center">
                    <div className="col-md-7 col-lg-8">
                        <p> © 2024 Bản quyền thuộc về 
                            <a href="#" className="text-warning text-decoration-none"> Perfume Store</a>
                        </p>
                    </div>
                    <div className="col-md-5 col-lg-4">
                        <div className="text-center text-md-end">
                            <ul className="list-unstyled list-inline">
                                <li className="list-inline-item">
                                    <a href="#" className="btn-floating btn-sm text-white" style={{fontSize: '23px'}}><i className="bi bi-facebook"></i></a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="#" className="btn-floating btn-sm text-white" style={{fontSize: '23px'}}><i className="bi bi-instagram"></i></a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="#" className="btn-floating btn-sm text-white" style={{fontSize: '23px'}}><i className="bi bi-youtube"></i></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;