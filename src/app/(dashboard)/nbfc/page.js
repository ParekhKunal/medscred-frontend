'use client'

import Navbar from '@/components/Navbar/Navbar'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Cards from '@/components/Cards/Cards';

function Nbfc() {
    const { user, loading, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!token) {
            router.push('/auth/login');
        }
        if (token == null || !user || user.data.role !== 5) {
            router.push('/auth/login');
        }
    }, [loading, user, router, token]);

    if (loading) return <div className='w-100 h-screen flex justify-center align-ceneter'>Loading...</div>;

    return (
        <div>
            <Navbar role={user?.data?.role} />
            <Header name={user?.data?.first_name} />
            <div className='flex justify-around align-center' >
                <Cards />
                <Cards />
                <Cards />
                <Cards />
            </div>
            <h1>NBFC</h1>
        </div>
    )
}

export default Nbfc
