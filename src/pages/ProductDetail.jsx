import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import axios from 'axios';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1); // Thêm state số lượng mua

    const API_URL = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {
        axios.get(`${API_URL}/api/products/${id}`)
            .then(res => {
                setProduct(res.data);
                if(res.data.variants.length > 0) {
                    setSelectedVariant(res.data.variants[0]);
                }
            })
            .catch(err => console.error(err));
    }, [id]);

    // --- HÀM XỬ LÝ THÊM VÀO GIỎ ---
    const handleAddToCart = () => {
        // 1. Kiểm tra đã đăng nhập chưa
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Bạn cần đăng nhập để mua hàng!");
            navigate('/login');
            return;
        }

        if (!selectedVariant) return;

        // 2. Gửi Request lên Server
        const data = {
            variant_id: selectedVariant.variant_id,
            quantity: quantity
        };

        // Quan trọng: Gửi kèm Token trong Header
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axios.post(`${API_URL}/api/cart/add`, data, config)
            .then(res => {
                alert(res.data.message); // "Đã thêm vào giỏ hàng thành công!"
            })
            .catch(err => {
                console.error(err);
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            });
    };

    if (!product) return <div className="text-center mt-5">Đang tải...</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 text-center">
                    <img src={product.thumbnail} className="img-fluid rounded shadow-sm" style={{maxHeight: '400px'}} alt={product.product_name} />
                </div>
                <div className="col-md-6">
                    <h2>{product.product_name}</h2>
                    <p className="text-muted">{product.brand?.brand_name} - {product.gender}</p>
                    
                    <h3 className="text-danger my-3">
                        {selectedVariant ? Number(selectedVariant.price).toLocaleString() : 0} đ
                    </h3>

                    {/* Chọn dung tích */}
                    <div className="mb-4">
                        <label className="fw-bold mb-2">Chọn dung tích:</label>
                        <div className="d-flex gap-2">
                            {product.variants.map(variant => (
                                <button 
                                    key={variant.variant_id}
                                    className={`btn ${selectedVariant?.variant_id === variant.variant_id ? 'btn-dark' : 'btn-outline-dark'}`}
                                    onClick={() => setSelectedVariant(variant)}
                                >
                                    {variant.volume}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chọn số lượng */}
                    <div className="mb-4 d-flex align-items-center gap-3">
                        <label className="fw-bold">Số lượng:</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            style={{width: '80px'}}
                            value={quantity}
                            min="1"
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                        />
                    </div>

                    {/* Nút Mua */}
                    <button 
                        className="btn btn-success btn-lg w-100"
                        onClick={handleAddToCart}
                        disabled={!selectedVariant} // Khóa nút nếu chưa chọn biến thể
                    >
                        <i className="bi bi-cart-plus me-2"></i> Thêm vào giỏ hàng
                    </button>
                    
                    <div className="mt-4">
                        <h5>Mô tả sản phẩm</h5>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;