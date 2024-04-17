import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import React, { useState } from 'react'
import axios from 'axios';
import { baseURL, userRoutes } from '@/api/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

function Login() {
    const [username, setUsername] = useState('test');
    const [password, setPassword] = useState('123');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            username: username,
            password: password
        };
        try {
            const response = await axios.post(`${baseURL}${userRoutes}/login`, userData)
            if (response.status==201) {
                alert(response.data.message)
                Cookies.set('token', response.data.token, { secure: true });
                router.push('/home');
            }else{
                console.error('Login failed with status:', response.status);
                alert('Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in');
        }
        
    };


    return (
        <div className="flex h-screen">
            {/* Phần Form đăng nhập (1/3) */}
            <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col justify-center bg-white p-8">
                <img width={48} height={48} src='/images/logo.png' alt="Logo" className="mr-2" />
                <h2 className="text-2xl mb-4">Đăng nhập</h2>
                <form onSubmit={handleSubmit}>
                    {/* Username input */}
                    <input
                        type="text"
                        value={username}
                        name='username'
                        id='username'
                        placeholder="Tên đăng nhập"
                        className="border rounded-lg px-4 py-2 mb-4 w-full focus:border-blue-500 focus:outline-none"
                        onChange={handleUsernameChange}
                    />

                    {/* Password input */}
                    <div className="relative mb-4">
                        <input
                            name='password'
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={handlePasswordChange}
                            className="border rounded-lg px-4 py-2 pr-10 w-full focus:border-blue-500 focus:outline-none"
                        />
                        {/* Biểu tượng con mắt */}
                        <span
                            className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
                            onClick={handleTogglePassword}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                        </span>
                    </div>
                    {/* Button login */}
                    <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                        Đăng nhập
                    </button>
                </form>
            </div>
            {/* Phần Hình ảnh (2/3) */}
            <div className="hidden md:block w-1/2 lg:w-2/3 bg-gray-400">
                <img className='w-full h-full object-cover' src="/images/background.jpg" alt="background" />
            </div>
        </div>
    )
}

export default Login

