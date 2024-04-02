import PasswordInput from '@/components/PasseordInput/PasswordInput'
import React from 'react'

function Login() {
    return (
        <>
            <div className="flex h-screen">
                {/* Phần Form đăng nhập (1/3) */}
                <div className="w-1/3 flex flex-col justify-center bg-white p-8">
                    <img width={48} height={48} src='/images/logo.png' alt="Logo" className="mr-2"/>
                    <h2 className="text-2xl mb-4">Đăng nhập</h2>

                    {/* Username input */}
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className="border rounded-lg px-4 py-2 mb-4 focus:border-blue-500 focus:outline-none"
                    />

                    {/* Password input */}
                    <PasswordInput placeholder={"Mật khẩu"}/>

                    {/* Button login */}
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                        Đăng nhập
                    </button>
                </div>
                {/* Phần Hình ảnh (2/3) */}
                <div className="w-2/3 bg-gray-400">
                    <img className='w-full h-full object-cover' src="/images/background.jpg" alt="background" />
                </div>
            </div>
        </>
    )
}

export default Login