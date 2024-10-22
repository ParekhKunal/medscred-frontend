'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import { Avatar, Button, Timeline, Tag, Upload, Input, Collapse, Panel, List, Modal, Tabs, Divider, Card, Select, Steps, Row, Col, Flex, Spin, Form, notification, Dropdown, Menu } from 'antd';
import { MailOutlined, UploadOutlined, FileOutlined, CheckCircleOutlined, UserOutlined, CloudOutlined, PlusOutlined, InboxOutlined, InfoCircleOutlined, FileTextOutlined, LoadingOutlined, DownOutlined } from '@ant-design/icons';
import Image from 'next/image';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import axios from 'axios';
import Notification from '@/components/Notifications/Notification';
import QRCode from 'qrcode';
import StatusUpdate from '@/components/Drawer/StatusUpdate';


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
    const { loading, token, user } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
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

    const handleMenuClick = (e) => {
        const newStatus = parseInt(e.key);
        setStatus(newStatus); // Update local state
        onUpdateStatus(newStatus); // Call the function to handle the status update
        notification.success({
            message: 'Status Updated',
            description: `Status changed to ${statusStyles[newStatus].text}.`,
        });
    };


    const showQRCodeModal = () => {
        if (hospitalData.document_upload_link) {
            QRCode.toDataURL(hospitalData.document_upload_link)
                .then(url => {
                    setQrCodeUrl(url);
                    setIsModalVisible(true);
                })
                .catch(err => {
                    console.error('Error generating QR code: ', err);
                    notification.error({
                        message: 'QR Code Generation Failed',
                        description: 'Could not generate QR code. Please try again later.',
                    });
                });
        }
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleCopyLink = () => {
        if (hospitalData.document_upload_link) {
            navigator.clipboard.writeText(hospitalData.document_upload_link)
                .then(() => {
                    notification.success({
                        message: 'Link Copied',
                        description: 'The link has been copied to your clipboard.',
                    });
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    notification.error({
                        message: 'Copy Failed',
                        description: 'Failed to copy the link. Please try again.',
                    });
                });
        } else {
            notification.warning({
                message: 'No Link',
                description: 'No document upload link available to copy.',
            });
        }
    };

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
        const newFileList = info.fileList.map(file => {
            if (file.response) {
                return {
                    ...file,
                    url: file.response.url
                };
            }
            return file;
        });
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fileType]: info.fileList,
        }));
    };

    const handleFileRemove = (fileType) => (file) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fileType]: prevFormData[fileType].filter(item => item.uid !== file.uid),
        }));
    };


    const uploadProps = (name) => ({
        name,
        multiple: true,
        fileList: formData[name] || [], // Use the name parameter to access the correct file list
        onChange: handleFileChange(name), // Pass the name for handling changes
        onRemove: handleFileRemove(name),
        showUploadList: true, // Show the list of uploaded files
        beforeUpload: (file) => false,
    });

    useEffect(() => {
        console.log('Updated formData:', formData);
    }, [formData]);


    const fetchHospitalDetails = async () => {
        setLoading(true);
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
                    cancelled_cheque: data.cancelled_cheque ? [{
                        uid: '-1',
                        name: 'Cancelled Cheque',
                        status: 'done',
                        url: data.cancelled_cheque
                    }] : [],
                    hospital_registration_certificate: data.hospital_registration_certificate ? [{
                        uid: '-2',
                        name: 'Hospital Registration Certificate',
                        status: 'done',
                        url: data.hospital_registration_certificate
                    }] : [],
                    hospital_pan_card: data.hospital_pan_card ? [{
                        uid: '-3',
                        name: 'PAN Card',
                        status: 'done',
                        url: data.hospital_pan_card
                    }] : [],
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

    useEffect(() => {
        fetchHospitalDetails();
    }, [token, id]);

    const handleStatusUpdate = () => {
        fetchHospitalDetails();
    };



    if (isLoading) {
        return <div className='flex justify-center w-full h-screen items-center'><Flex><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></Flex></div>;
    }

    return (

        <>
            <Navbar role={user?.data?.role} />
            <div className="max-w-8xl mx-auto p-6 bg-gray-50 min-h-screen">
                <h1 className="text-2xl p-6 font-bold mb-6 text-center">Edit Hospital Information</h1>

                <Card className="mb-8">
                    <div className="p-6 bg-gray-50">
                        {
                            hospitalData?.status == 4 && <div className="flex justify-between items-center bg-green-100 text-white-300 p-4 mb-6 rounded-md">
                                <span className="flex items-center">
                                    <InfoCircleOutlined className="mr-2" />
                                    {hospitalData.document_upload_link}
                                </span>
                                <div>
                                    <Button type="primary" onClick={handleCopyLink}>Copy Link</Button>
                                    <Button type="default" onClick={showQRCodeModal} className="ml-2">
                                        Show QR Code
                                    </Button>
                                </div>
                            </div>
                        }

                        <Modal
                            title="QR Code"
                            visible={isModalVisible}
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            {qrCodeUrl && (
                                <Image src={qrCodeUrl} alt="QR Code" style={{ width: '100%', height: 'auto' }} />
                            )}
                        </Modal>

                        <Notification currentStatus={hospitalData.status} />

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
                                        <span style={{ fontSize: '12px' }}>
                                            {hospitalData.email} {hospitalData.alternate_email ? `- {hospitalData.alternate_email}` : ''}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Phone Number:</strong> <br />
                                        <span style={{ fontSize: '12px' }}>
                                            {hospitalData.phone_number} {hospitalData.alternate_phone_number ? `- {hospitalData.alternate_phone_number}` : ''}
                                        </span>
                                    </div>
                                    <div className="md:col-span-2">
                                        <strong>Address:</strong> <br />
                                        <span style={{ fontSize: '12px' }}>
                                            {hospitalData?.address_line_1}, {hospitalData?.address_line_2}, {hospitalData?.city}, {hospitalData?.state}, India  {hospitalData.pin_code}
                                        </span>
                                    </div>
                                </div>
                                <div className="md:col-span-2 mt-4 w-full">
                                    <StatusUpdate token={token} currentStatus={hospitalData.status} hospitalId={hospitalData.id} onStatusUpdate={handleStatusUpdate} />
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
                                        <Button href={hospitalData.cancelled_cheque} icon={<FileTextOutlined />} target='_blank' rel="noopener noreferrer">View Cancelled Cheque</Button>
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
                                        <Button href="#" icon={<FileTextOutlined />} target='_blank' rel="noopener noreferrer">View MOU</Button>
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
                                <Steps current={hospitalData.status - 1} size="small" direction="horizontal" style={{ display: 'flex', minWidth: 'max-content' }}>
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

                <Form layout="vertical">
                    <Card title="Hospital Basic Details" className='w-full mb-4'>
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
                    </Card>

                    <Card title="Hospital Address" className='w-full mb-4'>
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
                            <Col span={8}>
                                <Form.Item
                                    label="City"
                                    name="country"
                                    initialValue="INDIA"
                                    rules={[{ required: true, message: 'Please input country!' }]}
                                >
                                    <Input name='country' disabled placeholder="Enter country" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Hospital Bank Details" className='w-full mb-4'>
                        <Row gutter={16} className='mt-2'>
                            <Col span={12}>
                                <Form.Item
                                    label="Account Holder Name"
                                    name="account_holder_name"
                                    initialValue={formData.account_holder_name}
                                    rules={[{ required: true, message: 'Please input Account Holder Name!' }]}
                                >
                                    <Input placeholder="Enter Account Holder Name" name='account_holder_name' value={formData.account_holder_name} onChange={handleInputChange} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Account Number"
                                    name="account_number"
                                    initialValue={formData.account_number}
                                >
                                    <Input placeholder="Enter Account Number" name='account_number' value={formData.account_number} onChange={handleInputChange} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16} className='mt-2'>
                            <Col span={12}>
                                <Form.Item
                                    label="Bank Name"
                                    name="bank_name"
                                    initialValue={formData.bank_name}
                                    rules={[{ required: true, message: 'Please input Bank Name!' }]}
                                >
                                    <Input name='bank_name' value={formData.bank_name} onChange={handleInputChange} placeholder="Enter Bank Name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="IFSC Code"
                                    name="ifsc_code"
                                    initialValue={formData.ifsc_code}
                                    rules={[{ required: true, message: 'Please input IFSC Code!' }]}
                                >
                                    <Input name='ifsc_code' value={formData.ifsc_code} onChange={handleInputChange} placeholder="Enter IFSC Code" />
                                </Form.Item>
                            </Col>

                        </Row>

                    </Card>

                    <Card title="Hospital Agreement Details" className='w-full mb-4'>
                        <Row gutter={16} className='mt-2'>
                            <Col span={12}>
                                <Form.Item
                                    label="*Reimbursement Commission"
                                    name="reimburse_commission"
                                    initialValue={formData.reimburse_commission}
                                >
                                    <Input placeholder="Enter Reimbursement Commission" name='reimburse_commission' value={formData.reimburse_commission} onChange={handleInputChange} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="*Cashless Commission"
                                    name="cashless_commission"
                                    initialValue={formData.cashless_commission}
                                >
                                    <Input placeholder="Enter Cashless Commission" name='cashless_commission' value={formData.cashless_commission} onChange={handleInputChange} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16} className='mt-2'>
                            <Col span={12}>
                                <Form.Item
                                    label="*Asthetic Commission"
                                    name="asthetic_commission"
                                    initialValue={formData.asthetic_commission}
                                >
                                    <Input name='asthetic_commission' value={formData.asthetic_commission} onChange={handleInputChange} placeholder="Enter Asthetic Commission" />
                                </Form.Item>
                            </Col>

                        </Row>

                    </Card>

                    <Card title="Upload Documents" className="mb-4">
                        <Row gutter={16}>
                            <Col span={8}>
                                <h1><span style={{ color: 'red' }}>*</span>Hospital Registration Certificate*</h1>
                                <Form.Item rules={[{ required: true, message: 'Please Upload The File' }]}>
                                    <Dragger {...uploadProps('hospital_registration_certificate')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Please upload Hospital Reg. Certificate</p>
                                    </Dragger>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <h1><span style={{ color: 'red' }}>*</span>Upload PAN Card*</h1>
                                <Form.Item rules={[{ required: true, message: 'Please Upload The File' }]}>
                                    <Dragger {...uploadProps('hospital_pan_card')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Please upload the PAN Card</p>
                                    </Dragger>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <h1><span style={{ color: 'red' }}>*</span>Upload Cancelled Cheque*</h1>
                                <Form.Item rules={[{ required: true, message: 'Please Upload The File' }]}>
                                    <Dragger {...uploadProps('cancelled_cheque')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Please upload a Cancelled Cheque</p>
                                    </Dragger>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <h1>Gst Certificate</h1>
                                <Form.Item>
                                    <Dragger {...uploadProps('gst_certificate')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Please upload the GST Certificate</p>
                                    </Dragger>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <h1>Certificate of Incorporation</h1>
                                <Form.Item>
                                    <Dragger {...uploadProps('certificate_of_incorporation')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Please upload the Certificate of Incor.</p>
                                    </Dragger>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <h1>Rohini Certificate</h1>
                                <Form.Item >
                                    <Dragger {...uploadProps('rohini_certificate')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Please upload the Rohini Certificate</p>
                                    </Dragger>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <div className="text-right">
                        <Button type="primary" size="large">
                            Save Changes
                        </Button>
                    </div>
                </Form>




            </div >

        </>

    )
}

export default EditHospital
