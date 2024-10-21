'use client'
import HospitalForm from '@/components/Forms/HospitalForm/HospitalForm';
import React from 'react';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/context/AuthContext';

const AddHospital = () => {

    useAuthRedirect('create_hospital');
    const { loading, token } = useAuth();


    return (
        <>
            <Navbar />
            <h1 className="text-3xl font-bold mt-8 mb-8 text-center text-[#008AFF]">Add New Hospital</h1>
            <HospitalForm token={token} />
        </>

    );
};

export default AddHospital;
