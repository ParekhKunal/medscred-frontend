import React from 'react'
import { Button } from 'antd';
import Image from 'next/image';
function Thanks() {
    return (
        <div className="w-[100%] flex justify-center items-center min-h-screen bg-gradient-to-r bg-slate-100">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[60%] ">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold" style={{ color: '#008aff' }}>MedsCred</h1>
                </div>

                {/* Main Content */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-blue-900">Thank You!</h2>
                    <p className="text-gray-500 mt-2">You have just done the hardest!</p>

                    <p className="text-gray-500 mt-6">What you want to do next?</p>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-center gap-4">
                        <Button type="default" className="border-blue-500 text-blue-500 hover:bg-blue-100">
                            Go back home
                        </Button>
                        <Button type="primary" className="bg-orange-500 border-none hover:bg-orange-600">
                            Explore more
                        </Button>
                    </div>

                    {/* Footer */}
                    <p className="text-gray-400 mt-8 text-sm">
                        *The payment invoice has been sent to your email.
                    </p>
                </div>

                {/* Illustration */}
                <div className="mt-8 flex justify-center">
                    <Image
                        width={265} height={140}
                        src="/public/assets/images/login-screen.png"
                        alt="Walking up stairs"
                        className="w-265 h-265"
                    />
                </div>
            </div>
        </div>
    )
}

export default Thanks
