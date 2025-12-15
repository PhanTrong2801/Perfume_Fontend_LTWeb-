import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function AdminProductForm() {
    const { id } = useParams(); // Nếu có id là Sửa, không có là Thêm
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    const isEdit = Boolean(id);

    // Data dropdown
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    // Form State
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [gender, setGender] = useState('Unisex');
    const [brandId, setBrandId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [thumbnail, setThumbnail] = useState(null); // File object
    const [previewImg, setPreviewImg] = useState(''); // URL để hiện ảnh preview

    // Variants State: Mảng các object
    const [variants, setVariants] = useState([
        { volume: '', price: '', stock_quantity: '', sku: '' }
    ]);

    // 1. Load dữ liệu Brands/Categories và Product (nếu là edit)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Lấy Brand/Category
        axios.get(`${API_URL}/api/admin/products/create-info`, config)
            .then(res => {
                setBrands(res.data.brands);
                setCategories(res.data.categories);
            });

        // Nếu là edit -> Lấy thông tin sản phẩm cũ đổ vào form
        if (isEdit) {
            axios.get(`${API_URL}/api/admin/products/${id}`, config)
                .then(res => {
                    const p = res.data;
                    setProductName(p.product_name);
                    setDescription(p.description || '');
                    setGender(p.gender);
                    setBrandId(p.brand_id);
                    setCategoryId(p.category_id);
                    setPreviewImg(p.thumbnail); // Link ảnh cũ
                    setVariants(p.variants);
                });
        }
    }, [id, isEdit, API_URL]);

    // 2. Xử lý Variants
    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { volume: '', price: '', stock_quantity: '', sku: '' }]);
    };

    const removeVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    // 3. Xử lý Submit Form
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Dùng FormData để gửi file
        const formData = new FormData();
        formData.append('product_name', productName);
        formData.append('description', description);
        formData.append('gender', gender);
        formData.append('brand_id', brandId);
        formData.append('category_id', categoryId);
        
        if (thumbnail) {
            formData.append('thumbnail', thumbnail); // Gửi file mới
        }
        
        // Gửi variants dưới dạng JSON String
        formData.append('variants', JSON.stringify(variants));

        // Nếu là Edit thì dùng POST (với _method=PUT để Laravel hiểu) vì FormData không hỗ trợ PUT trực tiếp tốt
        if (isEdit) {
            formData.append('_method', 'PUT'); 
            axios.post(`${API_URL}/api/admin/products/${id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => { alert("Cập nhật thành công!"); navigate('/admin/products'); })
            .catch(err => console.error(err));
        } else {
            // Thêm mới
            axios.post(`${API_URL}/api/admin/products`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(() => { alert("Thêm mới thành công!"); navigate('/admin/products'); })
            .catch(err => {
                console.error(err);
                alert("Lỗi! Vui lòng kiểm tra lại thông tin.");
            });
        }
    };

    return (
        <div className="container">
            <h2 className="mb-4">{isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={handleSubmit} className="row">
                {/* --- CỘT TRÁI: THÔNG TIN CHUNG --- */}
                <div className="col-md-8">
                    <div className="card mb-4 p-3 shadow-sm">
                        <div className="mb-3">
                            <label className="form-label">Tên sản phẩm</label>
                            <input type="text" className="form-control" value={productName} onChange={e => setProductName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mô tả</label>
                            <textarea className="form-control" rows="4" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                        </div>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Thương hiệu</label>
                                <select className="form-select" value={brandId} onChange={e => setBrandId(e.target.value)} required>
                                    <option value="">-- Chọn --</option>
                                    {brands.map(b => <option key={b.brand_id} value={b.brand_id}>{b.brand_name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Danh mục</label>
                                <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                                    <option value="">-- Chọn --</option>
                                    {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.category_name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Giới tính</label>
                                <select className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                                    <option value="Unisex">Unisex</option>
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* --- PHẦN BIẾN THỂ (VARIANTS) --- */}
                    <div className="card p-3 shadow-sm">
                        <h5 className="mb-3">Các phiên bản (Dung tích & Giá)</h5>
                        {variants.map((variant, index) => (
                            <div key={index} className="row g-2 align-items-end mb-2 border-bottom pb-2">
                                <div className="col-3">
                                    <label className="small">Dung tích</label>
                                    <input type="text" className="form-control form-control-sm" placeholder="VD: 50ml"
                                        value={variant.volume} onChange={e => handleVariantChange(index, 'volume', e.target.value)} required />
                                </div>
                                <div className="col-3">
                                    <label className="small">Giá bán</label>
                                    <input type="number" className="form-control form-control-sm" placeholder="VNĐ"
                                        value={variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value)} required />
                                </div>
                                <div className="col-3">
                                    <label className="small">Kho</label>
                                    <input type="number" className="form-control form-control-sm" 
                                        value={variant.stock_quantity} onChange={e => handleVariantChange(index, 'stock_quantity', e.target.value)} required />
                                </div>
                                <div className="col-2">
                                    <label className="small">SKU (Mã)</label>
                                    <input type="text" className="form-control form-control-sm" 
                                        value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} />
                                </div>
                                <div className="col-1">
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeVariant(index)}>X</button>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="btn btn-sm btn-secondary mt-2 w-100" onClick={addVariant}>+ Thêm phiên bản</button>
                    </div>
                </div>

                {/* --- CỘT PHẢI: ẢNH ĐẠI DIỆN --- */}
                <div className="col-md-4">
                    <div className="card p-3 shadow-sm text-center">
                        <label className="form-label fw-bold">Ảnh đại diện</label>
                        <div className="mb-3 border rounded p-2" style={{minHeight: '200px', backgroundColor: '#f8f9fa'}}>
                            {previewImg ? (
                                <img src={previewImg} className="img-fluid" alt="Preview" />
                            ) : (
                                <p className="text-muted mt-5">Chưa có ảnh</p>
                            )}
                        </div>
                        <input type="file" className="form-control" accept="image/*" onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setThumbnail(file);
                                setPreviewImg(URL.createObjectURL(file)); // Xem thử ảnh ngay khi chọn
                            }
                        }} />
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                        {isEdit ? 'Lưu cập nhật' : 'Tạo sản phẩm'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate('/admin/products')}>Hủy bỏ</button>
                </div>
            </form>
        </div>
    );
}

export default AdminProductForm;