import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        axios.post(`${API_URL}/api/login`, formData)
            .then(res => {
                // LƯU TOKEN VÀO LOCAL STORAGE QUAN TRỌNG
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user_info', JSON.stringify(res.data.user));
                
                alert('Đăng nhập thành công!');
                navigate('/'); // Chuyển về trang chủ
                window.location.reload(); // Reload để cập nhật thanh menu
            })
            .catch(() => {
                setError('Sai tên đăng nhập hoặc mật khẩu!');
            });
    };

    return (
        <div className="container mt-5" style={{maxWidth: '500px'}}>
            <h2 className="text-center">Đăng Nhập</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="mb-3">
                    <label>Tên đăng nhập:</label>
                    <input 
                        type="text" 
                        name="username"
                        className="form-control" 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label>Mật khẩu:</label>
                    <input 
                        type="password" 
                        name="password"
                        className="form-control" 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Đăng Nhập</button>
            </form>
        </div>
    );
}

export default LoginPage;