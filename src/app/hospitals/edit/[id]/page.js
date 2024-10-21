'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import { Avatar, Button, Timeline, Tag, Upload, Input, Collapse, Panel, List, Modal, Tabs, Divider, Card, Select, Steps, Row, Col, Flex, Spin, Form } from 'antd';
import { MailOutlined, UploadOutlined, FileOutlined, CheckCircleOutlined, UserOutlined, CloudOutlined, PlusOutlined, InboxOutlined, InfoCircleOutlined, FileTextOutlined, LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import axios from 'axios';



const files = [
    { id: '1', name: "Check Up Result.pdf", size: "123kb" },
    { id: '2', name: "Dental X-Ray Result 2.pdf", size: "134kb" },
    { id: '3', name: "Medical Prescriptions.pdf", size: "87kb" },
];

const { Option } = Select;
const { Dragger } = Upload;
const { Step } = Steps;

const { TabPane } = Tabs;

function EditHospital() {

    useAuthRedirect('update_hospital');

    const { id } = useParams();
    const { loading, token } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        permission_name: 'create_hospital',
        account_type: [],
        first_name: '',
        email: '',
        phone_number: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        pin_code: '',
        account_holder_name: '',
        account_number: '',
        bank_name: '',
        ifsc_code: '',
        hospital_registration_certificate: null,
        hospital_pan_card: null,
        cancelled_cheque: null,
    });

    const [hospitalData, setHospitalData] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSelectChange = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            account_type: value,
        }));
    };

    const handleFileChange = (fileType) => (info) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fileType]: info.fileList,
        }));
    };

    const uploadProps = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    useEffect(() => {
        console.log('Updated formData:', formData);
    }, [formData]);

    useEffect(() => {
        // Fetch hospital details when the component mounts
        const fetchHospitalDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5500/api/v1/hospitals/get-hospital-by-id/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data && response.data.status === 'OK') {
                    const data = response.data.data[0];
                    setHospitalData(data);
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        account_type: data.account_type.split(','),
                        first_name: data.first_name,
                        email: data.email,
                        phone_number: data.phone_number,
                        address_line_1: data.address_line_1,
                        address_line_2: data.address_line_2,
                        city: data.city,
                        state: data.state,
                        pin_code: data.pin_code,
                        account_holder_name: data.account_holder_name,
                        account_number: data.account_number,
                        bank_name: data.bank_name,
                        ifsc_code: data.ifsc_code,
                    }));
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'Hospital not found or invalid link.',
                    });
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch hospital details', error);
                setLoading(false);
            }
        };

        fetchHospitalDetails();
    }, [token, id]);





    if (isLoading) {
        return <div className='flex justify-center w-full h-screen items-center'><Flex><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></Flex></div>;
    }

    return (

        <>
            <Navbar />
            <div className="max-w-8xl mx-auto p-6 bg-gray-50 min-h-screen">
                <h1 className="text-2xl p-6 font-bold mb-6 text-center">Edit Hospital Information</h1>

                <Card className="mb-8">
                    <div className="p-6 bg-gray-50">
                        <div className="flex justify-between items-center bg-blue-100 text-blue-800 p-4 mb-6 rounded-md">
                            <span className="flex items-center">
                                <InfoCircleOutlined className="mr-2" />
                                Dr. Hannibal Smith has some unverified information.
                            </span>
                            <Button type="primary">Verify Information</Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                            <Card className="shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">Hospital Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <strong>Hospital Name:</strong> <br />
                                        {hospitalData.first_name}
                                    </div>
                                    <div>
                                        <strong>Hospital Type:</strong> <br />
                                        {hospitalData.account_type.split(',').map((type) => {
                                            let color;
                                            switch (type.toLowerCase()) {
                                                case 'reimbursement':
                                                    color = 'red'; // Example color for reimbursement
                                                    break;
                                                case 'cashless':
                                                    color = 'blue'; // Example color for cashless
                                                    break;
                                                case 'aesthetic':
                                                    color = 'green'; // Example color for aesthetic
                                                    break;
                                                default:
                                                    color = 'gray'; // Default color if no match
                                            }

                                            return (
                                                <Tag color={color} key={type}>
                                                    {type.toUpperCase()}
                                                </Tag>
                                            );
                                        })}
                                    </div>
                                    <div>
                                        <strong>Email:</strong> <br />
                                        {hospitalData.email} {hospitalData.alternate_email ? `- {hospitalData.alternate_email}` : ''}
                                    </div>
                                    <div>
                                        <strong>Phone Number:</strong> <br />
                                        {hospitalData.phone_number} {hospitalData.alternate_phone_number ? `- {hospitalData.alternate_phone_number}` : ''}
                                    </div>
                                    <div className="md:col-span-2">
                                        <strong>Address:</strong> <br />
                                        {hospitalData?.address_line_1}, {hospitalData?.address_line_2}, {hospitalData?.city}, {hospitalData?.state}, India  {hospitalData.pin_code}
                                    </div>
                                </div>
                            </Card>

                            <Card className="shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">Bank Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <strong>Account Number</strong> <br />
                                        {hospitalData.account_number ? hospitalData.account_number : 'No Data Available'}
                                    </div>
                                    <div>
                                        <strong>Account Holder Name</strong> <br />
                                        {hospitalData.account_holder_name ? hospitalData.account_holder_name : 'No Data Available'}
                                    </div>
                                    <div>
                                        <strong>Bank Name</strong> <br />
                                        {hospitalData.bank_name ? hospitalData.bank_name : 'No Data Available'}
                                    </div>
                                    <div>
                                        <strong>IFSC Code</strong> <br />
                                        {hospitalData.ifsc_code ? hospitalData.ifsc_code : 'No Data Available'}
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <Button icon={<FileTextOutlined />}>View Cancelled Cheque</Button>
                                    </div>
                                </div>
                            </Card>

                            <Card className="shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">Aggrement Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <strong>Reimbursement Comm.</strong> <br />
                                        {hospitalData.reimburse_commission ? hospitalData.reimburse_commission : 'No Data Available'}
                                    </div>
                                    <div>
                                        <strong>Cashless Comm.</strong> <br />
                                        {hospitalData.cashless_commission ? hospitalData.cashless_commission : 'No Data Available'}
                                    </div>
                                    <div>
                                        <strong>Asthetic Comm.</strong> <br />
                                        {hospitalData.asthetic_commission ? hospitalData.asthetic_commission : 'No Data Available'}
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <Button icon={<FileTextOutlined />}>View MOU</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </Card>

                <Card className="mb-8">
                    <div className="flex items-center p-6 bg-gray-50 w-full">
                        <Card title="Status Timeline" className="w-full shadow-lg">
                            <div style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px 0', display: 'flex', scrollbarWidth: 'thin' }}>
                                <Steps current={hospitalData.status} size="small" direction="horizontal" style={{ display: 'flex', minWidth: 'max-content' }}>
                                    <Step title="Open Lead" description="Basic Hospital Details Added On Portal Without Documents." />
                                    <Step title="Under Process" description="Document Collection Stage & Bank Details" />
                                    <Step title="Doc Received" description="Documents Received From Hospital Or MedsCred" />
                                    <Step title="Doc Veri" description="Received Documents Verification Stage" />
                                    <Step title="MOU Send" description="Once Document Verified MOU Send" />
                                    <Step title="MOU Received" description="MOU Received" />
                                    <Step title="Verification" description="Under verification by MedsCred" />
                                    <Step title="Onboarded" description="Email & Password Sending Stage" />
                                    <Step title="Deal Closed" description="No Further Action" />
                                </Steps>
                            </div>
                        </Card>
                    </div>
                </Card>

                <Card title="Hospital Details" className='w-full'>
                    <Form layout="vertical">
                        <Row gutter={16} className='mt-2'>
                            <Col span={12}>
                                <Form.Item
                                    label="Account Type"
                                    name="account_type"
                                    initialValue={formData.account_type}
                                    rules={[{ required: true, message: 'Please select account type!' }]}
                                >
                                    <Select name="account_type" mode="multiple" placeholder="Select account types" onChange={handleSelectChange} value={formData.account_type}>
                                        <Option value="Reimbursement">Reimbursement</Option>
                                        <Option value="Cashless">Cashless</Option>
                                        <Option value="Aesthetic">Aesthetic</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Hospital Name"
                                    name="hospitalName"
                                    initialValue={formData.first_name}
                                    rules={[{ required: true, message: 'Please input Hospital Name' }]}
                                >
                                    <Input name='first_name' value={formData.first_name} onChange={handleInputChange} placeholder="Enter Hospital Name" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16} className='mt-2'>
                            <Col span={12}>
                                <Form.Item
                                    label="Hospital Phone Number"
                                    name="hospitalPhoneNumber"
                                    initialValue={formData.phone_number}
                                    rules={[{ required: true, message: 'Please input valid Phone Number', min: 10, max: 12 }]}
                                >
                                    <Input type="number" name="phone_number" minLength={10} maxLength={12} placeholder="Enter Hospital Phone Number" value={formData.phone_number} onChange={handleInputChange} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Hospital Email"
                                    name="hospitalEmail"
                                    initialValue={formData.email}
                                    rules={[{ required: true, type: 'email', message: 'Please input valid Email' }]}
                                >
                                    <Input type="email" name='email' placeholder="Enter Hospital Email" value={formData.email} onChange={handleInputChange} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16} className='mt-2'>
                            <Col span={8}>
                                <Form.Item
                                    label="Address Line 1"
                                    name="address_line_1"
                                    initialValue={formData.address_line_1}
                                    rules={[{ required: true, message: 'Please input Address Line 1!' }]}
                                >
                                    <Input placeholder="Enter Address Line 1" name='address_line_1' value={formData.address_line_1} onChange={handleInputChange} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Address Line 2"
                                    name="address_line_2"
                                    initialValue={formData.address_line_2}
                                >
                                    <Input placeholder="Enter Address Line 2" name='address_line_2' value={formData.address_line_2} onChange={handleInputChange} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="City"
                                    name="city"
                                    initialValue={formData.city}
                                    rules={[{ required: true, message: 'Please input City!' }]}
                                >
                                    <Input name='city' value={formData.city} onChange={handleInputChange} placeholder="Enter City" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16} className='mt-2'>
                            <Col span={8}>
                                <Form.Item
                                    label="State"
                                    name="state"
                                    initialValue={formData.state}
                                    rules={[{ required: true, message: 'Please input your State!' }]}
                                >
                                    <Input name='state' value={formData.state} onChange={handleInputChange} placeholder="Enter State" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Pin Code"
                                    name="pin_code"
                                    initialValue={formData.pin_code}
                                    rules={[{ required: true, message: 'Please input Pin Code!' }]}
                                >
                                    <Input name='pin_code' value={formData.pin_code} onChange={handleInputChange} placeholder="Enter Pin Code" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                </Card>

                <Card title="Upload Documents" className="mb-8">
                    <Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                            band files.
                        </p>
                    </Dragger>
                </Card>


                <div className="text-right">
                    <Button type="primary" size="large">
                        Save Changes
                    </Button>
                </div>
            </div>

        </>

    )
}

export default EditHospital
