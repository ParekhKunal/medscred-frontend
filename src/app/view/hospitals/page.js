
'use client'

import Navbar from '@/components/Navbar/Navbar'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Cards from '@/components/Cards/Cards';
import HospitalsList from '@/components/DataGrid/HospitalsList';
import { Button, Divider, Flex, Spin } from 'antd';
import { PlusOutlined, FileExcelOutlined, LoadingOutlined } from '@ant-design/icons';
import useAuthRedirect from '@/hooks/useAuthRedirect';

function Hospitals() {

    useAuthRedirect('view_hospital');

    const router = useRouter();
    const { loading, token, user } = useAuth();
    const [hospitalData, setHospitalData] = useState([]);

    useEffect(() => {
        const fetchHospitalList = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hospitals/get-hospitals`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch hospitals');
                }

                const data = await response.json();
                console.log(data.data);

                setHospitalData(data.data);
            } catch (error) {
                console.error('Error fetching hospitals:', error);
            }
        };

        if (token) {
            fetchHospitalList(); // Trigger API call if token is available
        }
    }, [token]);

    const handleExport = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hospitals/export-all`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `hospital_data.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className='flex justify-center w-full h-screen items-center'><Flex><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></Flex></div>;

    return (
        <div>
            <Navbar role={user?.data?.role} />
            <div className="w-[85%] items-center justify-between mt-8 ml-24 flex">
                <h1 className="text-3xl font-bold mb-2" >Hospitals List</h1>
                <div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/add/hospitals')}>
                        Add Hospital
                    </Button>
                    {user?.data?.role == 1 &&
                        <Button className='ml-8' type="primary" icon={<FileExcelOutlined />} onClick={handleExport}>
                            Export Data
                        </Button>
                    }
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <HospitalsList hospitalData={hospitalData} datasize={8} />
            </div>
        </div>
    )
}

export default Hospitals
