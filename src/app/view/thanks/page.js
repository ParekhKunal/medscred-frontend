"use client";

import React, { Suspense } from 'react'
import { Button } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { Row, Col, Card, Statistic, Calendar, Tooltip, Badge, Popover, List, Flex, Spin, Skeleton } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, UserAddOutlined, UserOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';

const ThanksPage = () => {
    const searchParams = useSearchParams();
    const firstName = searchParams.get('firstName');
    const email = searchParams.get('email');
    const phoneNumber = searchParams.get('phoneNumber');

    const subject = encodeURIComponent("Document Submission Notification");
    const body = encodeURIComponent(`We have successfully submitted the document!\n\nName: ${firstName}\nEmail: ${email}\nPhone Number: ${phoneNumber}`);
    const emailLink = `mailto:info@medscred.com?subject=${subject}&body=${body}`;

    return (
        <div>
            <div className="w-[100%] flex justify-center items-center min-h-screen bg-gradient-to-r bg-slate-100">
                <div className="bg-white rounded-lg shadow-lg p-8 w-[60%] ">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold" style={{ color: '#008aff' }}>MedsCred</h1>
                    </div>

                    {/* Main Content */}
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-blue-900">Thank You!</h2>
                        <p className="text-gray-500 mt-2">You have just done the hardest by filling up the form!</p>
                        <div className="mt-4">
                            <Button
                                type="default"
                                onClick={() => window.location.href = emailLink}
                            >
                                Notify Us by Email
                            </Button>
                        </div>
                        <p className="text-gray-400 mt-8 text-sm">
                            MedsCred
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Thanks() {



    return (
        <Suspense fallback={<div className='flex justify-center w-full h-screen items-center'><Flex><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></Flex></div>}>
            <ThanksPage />
        </Suspense>

    )
}

export default Thanks
