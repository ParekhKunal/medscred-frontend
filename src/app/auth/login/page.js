'use client'
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import './style.css'
import axios from 'axios';
import Image from 'next/image';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            // Replace with your actual API call
            const data = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
                email,
                password,
            });

            login(data.data.accessToken)
            const role = data.data.data.role
            console.log(role)

            if (role == 1) {
                router.replace('/admin');
            } else if (role == 2) {
                router.replace('/sales');
            } else if (role == 4) {
                router.replace('/partner');
            } else if (role == 5) {
                router.replace('/nbfc');
            } else if (role == 6) {
                router.replace('/hr');
            } else if (role == 7) {
                router.replace('/operations');
            } else {
                console.error('Unknown user role:', role);
            }
        } catch (error) {
            console.error('Login failed:', error);
        }

    };

    return (
        <section className='bg-slate-100'>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div
                    className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0"
                >
                    <div className="flex flex-col justify-center p-8 md:p-14">
                        <span className="mb-3 text-4xl font-bold">Welcome back</span>
                        <span className="font-light text-gray-400 mb-8">
                            Welcome back! Please enter your details
                        </span>
                        <form onSubmit={handleSubmit}>
                            <div className="py-4">
                                <span className="mb-2 text-md font-bold">Email</span>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    name="email"
                                    value={email}
                                    id="email"
                                    placeholder='email@mail.com'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="py-4">
                                <span className="mb-2 text-md font-bold">Password</span>
                                <input
                                    type="password"
                                    name="pass"
                                    id="pass"
                                    value={password}
                                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                                    placeholder='******'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between w-full py-4">
                                <div className="mr-24">
                                    <input type="checkbox" name="ch" id="ch" className="mr-2" />
                                    <span className="text-md">Terms & Conditions</span>
                                </div>
                                <span className="font-bold text-md">Forgot password</span>
                            </div>
                            <button type='submit'
                                className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300 transition-all duration-500"
                            >
                                Sign in
                            </button>
                        </form>
                        <button
                            className="w-full border border-gray-300 text-md p-2 rounded-lg mb-6 hover:bg-black hover:text-white transition-all duration-500"
                        >
                            <Image src="../../../assets/icon/google.svg" width={20} height={20} alt="img" className=" inline mr-2" />
                            Sign in with Google
                        </button>
                        <div className="text-center text-gray-400">
                            Dont have an account?
                            <span className="font-bold text-black">Sign up for free</span>
                        </div>
                    </div>
                    <div className="relative">
                        <Image
                            src="/assets/images/login-screen.png"
                            alt="img"
                            width={960} height={1080}
                            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
                        />
                        <div
                            className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block"
                        >
                            <span className="text-white text-l"
                            >A unified platform for Health <br /> Care Providers and their patients to <br /> address their
                                Finance & Insurance needs
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
