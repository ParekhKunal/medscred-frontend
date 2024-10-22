
'use client'

import Navbar from '@/components/Navbar/Navbar'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Cards from '@/components/Cards/Cards';
import HospitalsList from '@/components/DataGrid/HospitalsList';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useAuthRedirect from '@/hooks/useAuthRedirect';

function Hospitals() {

    useAuthRedirect('view_hospital');

    const router = useRouter();
    const { loading, token, user } = useAuth();
    const [hospitalData, setHospitalData] = useState([]);

    useEffect(() => {
        const fetchHospitalList = async () => {
            try {
                const response = await fetch('http://localhost:5500/api/v1/hospitals/get-hospitals', {
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

    if (loading) return <div className='w-100 h-screen flex justify-center align-ceneter'>Loading...</div>;

    return (
        <div>
            <Navbar role={user?.data?.role} />
            <div className="w-100 items-center justify-around mt-8 mb-8 ml-24">
                <h1 className="text-3xl font-bold mb-4" >Hospitals List</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/add/hospitals')}>
                    Add Hospital
                </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <HospitalsList hospitalData={hospitalData} datasize={8} />
            </div>
        </div>
    )
}

export default Hospitals
