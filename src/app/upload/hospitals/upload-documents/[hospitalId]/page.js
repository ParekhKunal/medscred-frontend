'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Upload, Spin, notification, Typography, Space, Row, Col, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Dragger } = Upload;
const { Item: FormItem } = Form;
const { Title, Text } = Typography;

function UploadDocuments({ params }) {

    //unicode
    const { hospitalId } = params;


    const [hospitalData, setHospitalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const router = useRouter();

    const [formData, setFormData] = useState({
        unicode: hospitalId,
        account_holder_name: '',
        account_number: '',
        bank_name: '',
        ifsc_code: '',
        hospital_registration_certificate: null,
        hospital_pan_card: null,
        cancelled_cheque: null,
        gst_certificate: null,
        certificate_of_incorporation: null,
        rohini_certificate: null,
    });


    // Fetch hospital data on component mount
    useEffect(() => {
        const fetchHospitalData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hospitals/get-hospital-by-unicode/${hospitalId}`);
                if (response.data && response.data.status === 'OK') {
                    setHospitalData(response.data.data[0]); // Access first element
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'Hospital not found or invalid link.',
                    });
                    router.push('/error');
                }
            } catch (error) {
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch hospital data.',
                });
                router.push('/error');
            } finally {
                setLoading(false);
            }
        };

        fetchHospitalData();
    }, [hospitalId, router]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            account_type: value.join(','),
        }));
    };

    const handleFileChange = (fileType) => (info) => {
        setFormData((prevData) => ({
            ...prevData,
            [fileType]: info.fileList,
        }));
    };

    const handleUploadChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const onSubmit = async () => {
        try {
            // Prepare data for submission
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((file) => {
                        submitData.append(key, file.originFileObj);
                    });
                } else {
                    submitData.append(key, value);
                }
            });

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/hospitals/update-hospital-by-unicode/${hospitalId}`,
                submitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            message.success('Thanks For Submitting the Data');

            router.replace('/view/thanks')

        } catch (error) {
            console.error('Error submitting form:', error);
            message.error('Something went wrong during submission');
        }
    };

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Form',
            description:
                'Please complete all required fields before proceeding.',
        });
    };

    const uploadProps = (name) => ({
        name,
        multiple: true,
        fileList: formData[name], // Use the name parameter to access the correct file list
        onChange: handleFileChange(name), // Pass the name for handling changes
        showUploadList: true, // Show the list of uploaded files
    });

    if (loading) {
        return (
            <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px' }}>
            <Card
                bordered="false"
                style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                    padding: '40px',
                    backgroundColor: '#fff',
                }}
            >
                <Title level={2} style={{ textAlign: 'center', marginBottom: '10px' }}>
                    Hi <span style={{ color: '#008aff' }}> {hospitalData.first_name}</span>, Welcome To MedsCred <span style={{ color: '#1890ff' }}></span>
                </Title>
                <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Please Upload Related Documents to complete your onboarding process
                </p>

                <Form layout="vertical"
                    onFinish={onSubmit}>

                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Text strong>Hospital Name:</Text>
                            <Input value={hospitalData.first_name} disabled style={{ marginBottom: '15px' }} />
                        </Col>
                        <Col span={8}>
                            <Text strong>Email:</Text>
                            <Input value={hospitalData.email} disabled style={{ marginBottom: '15px' }} />
                        </Col>
                        <Col span={8}>
                            <Text strong>Phone Number:</Text>
                            <Input value={hospitalData.phone_number} disabled style={{ marginBottom: '15px' }} />
                        </Col>
                        <Col span={24}>
                            <Text strong>Address:</Text>
                            <Input
                                value={`${hospitalData?.address_line_1}, ${hospitalData.address_line_2}, ${hospitalData.city}, ${hospitalData.state}, ${hospitalData.country}, ${hospitalData.pincode}`}
                                disabled
                                style={{ marginBottom: '10px' }}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginBottom: '30px', color: 'lightgray' }}>
                        <Col span={24}>*To Change the Your Hospital Information Contact the MedsCred Support Team</Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '20px', color: 'lightgray' }}>
                        <Col span={12}>
                            <Text strong>Alternate Phone Number</Text>
                            <Form.Item
                                name="alternate_phone_number"
                                rules={[{ min: 10, max: 12, required: false, message: 'Input Valid Phone Number' }]}
                            >
                                <Input type="number" minLength={10} maxLength={12} name='alternate_phone_number' value={formData.alternate_phone_number}
                                    onChange={handleInputChange} placeholder="Enter Alternate Phone Number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Text strong>Alternate Email</Text>
                            <Form.Item
                                name="alternate_email"
                                rules={[{ required: false, message: 'Input Valid Email' }]}
                            >
                                <Input name='alternate_email' value={formData.alternate_email}
                                    onChange={handleInputChange} placeholder="Enter Alternate Email" type='email' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title level={2} style={{ fontSize: '24px' }}>
                        Bank Details
                    </Title>
                    <hr />

                    <Row gutter={[16, 16]} className='mt-8'>
                        <Col span={12}>
                            <Text strong><span style={{ color: 'red' }}>*</span>Account Holder Name</Text>
                            <Form.Item
                                name="account_holder_name"
                                rules={[{ required: true, message: 'Please input Account Holder Name!' }]}
                            >
                                <Input name='account_holder_name' value={formData.account_holder_name}
                                    onChange={handleInputChange} placeholder="Enter Account Holder Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Text strong><span style={{ color: 'red' }}>*</span>Account Number</Text>
                            <Form.Item
                                name="account_number"
                                rules={[{ required: true, message: 'Please input Account Number!' }]}
                            >
                                <Input name='account_number' value={formData.account_number}
                                    onChange={handleInputChange} placeholder="Enter Account Number" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16} className='mt-2'>
                        <Col span={12}>
                            <Text strong><span style={{ color: 'red' }}>*</span>Bank Name</Text>
                            <Form.Item
                                name="bank_name"
                                rules={[{ required: true, message: 'Please input Bank Name!' }]}
                            >
                                <Input name='bank_name' value={formData.bank_name}
                                    onChange={handleInputChange} placeholder="Enter Bank Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Text strong><span style={{ color: 'red' }}>*</span>IFSC Code</Text>
                            <Form.Item
                                name="ifsc_code"
                                rules={[{ required: true, message: 'Please input IFSC Code!' }]}
                            >
                                <Input name='ifsc_code' value={formData.ifsc_code}
                                    onChange={handleInputChange} placeholder="Enter IFSC Code" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title level={4} style={{ marginBottom: '20px' }}>
                        Upload Required Documents
                    </Title>

                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Row gutter={16}>
                            {!hospitalData.hospital_registration_certificate && <Col span={8}>
                                <h1><span style={{ color: 'red' }}>*</span>Hospital Registration Certificate*</h1>
                                <FormItem rules={[{ required: true, message: 'Please Upload The File' }]}>
                                    <Dragger {...uploadProps('hospital_registration_certificate')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Please upload Hospital Reg. Certificate</p>
                                    </Dragger>
                                </FormItem>
                            </Col>
                            }
                            {!hospitalData.hospital_pan_card &&
                                <Col>
                                    <h1><span style={{ color: 'red' }}>*</span>Upload PAN Card*</h1>
                                    <FormItem rules={[{ required: true, message: 'Please Upload The File' }]}>
                                        <Dragger {...uploadProps('hospital_pan_card')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                            <p className="ant-upload-hint">Please upload the PAN Card</p>
                                        </Dragger>
                                    </FormItem>
                                </Col>
                            }
                            {!hospitalData.cancelled_cheque &&
                                <Col span={8}>
                                    <h1><span style={{ color: 'red' }}>*</span>Upload Cancelled Cheque*</h1>
                                    <FormItem rules={[{ required: true, message: 'Please Upload The File' }]}>
                                        <Dragger {...uploadProps('cancelled_cheque')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                            <p className="ant-upload-hint">Please upload a Cancelled Cheque</p>
                                        </Dragger>
                                    </FormItem>
                                </Col>
                            }
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <h1>Gst Certificate</h1>
                                <FormItem>
                                    <Dragger {...uploadProps('gst_certificate')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Please upload the GST Certificate</p>
                                    </Dragger>
                                </FormItem>
                            </Col>

                            <Col span={8}>
                                <h1>Certificate of Incorporation</h1>
                                <FormItem>
                                    <Dragger {...uploadProps('certificate_of_incorporation')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Please upload the Certificate of Incor.</p>
                                    </Dragger>
                                </FormItem>
                            </Col>

                            <Col span={8}>
                                <h1>Rohini Certificate</h1>
                                <FormItem >
                                    <Dragger {...uploadProps('rohini_certificate')} style={{ width: '100%', height: '80px', padding: '20px' }}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">Please upload the Rohini Certificate</p>
                                    </Dragger>
                                </FormItem>
                            </Col>
                        </Row>
                    </Space>

                    <Button type="primary" htmlType='submit' size="large" block style={{ marginTop: '40px' }}>
                        Submit Details & Documents
                    </Button>
                </Form>
            </Card>
        </div >
    );
}

export default UploadDocuments;
