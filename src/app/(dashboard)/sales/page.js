'use client'

import React from 'react'
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

function Sales() {

    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) return <p>Loading...</p>;

    if (!user || user.role !== 'sales') {
        router.push('/auth/login');
        return null;
    }
    return (
        <div>
            <h1>Sales</h1>
        </div>
    )
}

export default Sales
