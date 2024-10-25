import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Space, DatePicker, Select, Upload, message, Steps, Row, Col, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const { Option } = Select;

const { Step } = Steps;

const HospitalForm = ({ token }) => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = React.useState(0);
    const [api, contextHolder] = notification.useNotification();

    const [formData, setFormData] = useState({
        permission_name: 'create_hospital',
        account_type: '',
        first_name: '',
        email: '',
        phone_number: '',
        account_type: '',
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

    const onFinish = async () => {
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
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/hospitals/create-hospital`,
                submitData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 201) {
                const hospitalId = response.data.data;
                message.success('Hospital registered successfully');
                router.replace(`/edit/hospitals/${hospitalId}`);
            } else if (response.status === 400) {
                message.error(response.data.error || 'Invalid input');
            } else if (response.status === 404) {
                message.info(response.data.message || 'Hospital already exists');
            } else {
                message.error('Unexpected status code');
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    message.error(error.response.data.error || 'Invalid input');
                } else if (error.response.status === 404) {
                    message.error(error.response.data.message || 'Hospital already exists');
                } else if (error.response.status === 500) {
                    message.error('Internal server error');
                } else {
                    message.error('Something went wrong during submission');
                }
            } else {
                // Log if the issue is not related to the response (network issues, etc.)
                console.error('Error:', error.message);
                message.error('Something went wrong during submission');
            }
        }
    };

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Form',
            description:
                'Please complete all required fields before proceeding.',
        });
    };

    const nextStep = async () => {
        try {
            await form.validateFields();
            setCurrentStep((prev) => prev + 1);
        } catch (errorInfo) {
            openNotificationWithIcon('error')
            console.log('Validation Failed:', errorInfo);
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    return (
        <>
            {contextHolder}

            <div style={{ width: '70%', margin: '0 auto', padding: '40px', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Steps current={currentStep} style={{ marginBottom: '20px' }}>
                    <Step title="Basic Details" />
                    <Step title="Address" />
                    <Step title="Account Details" />
                    <Step title="Documents" />
                    <Step title="Summary" />
                </Steps>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    {currentStep === 0 && (
                        <>
                            <Row gutter={16} className='mt-2'>
                                <Col span={12}>
                                    <Form.Item
                                        label="Account Type"
                                        name="account_type"
                                        rules={[{ required: true, message: 'Please select account type!' }]}
                                    >
                                        <Select name="account_type" mode="multiple" placeholder="Select account types" onChange={handleSelectChange}>
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
                                        rules={[{ required: true, message: 'Please input valid Phone Number', min: 10, max: 15 }]}
                                    >
                                        <Input type="number" name="phone_number" minLength={10} maxLength={12} placeholder="Enter Hospital Phone Number" value={formData.phone_number} onChange={handleInputChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Hospital Email"
                                        name="hospitalEmail"
                                        rules={[{ required: true, type: 'email', message: 'Please input valid Email' }]}
                                    >
                                        <Input type="email" name='email' placeholder="Enter Hospital Email" value={formData.email} onChange={handleInputChange} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}

                    {currentStep === 1 && (
                        <>
                            <Row gutter={16} className='mt-2'>
                                <Col span={8}>
                                    <Form.Item
                                        label="Address Line 1"
                                        name="address_line_1"
                                        rules={[{ required: true, message: 'Please input Address Line 1!' }]}
                                    >
                                        <Input placeholder="Enter Address Line 1" name='address_line_1' value={formData.address_line_1} onChange={handleInputChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Address Line 2"
                                        name="address_line_2"
                                    >
                                        <Input placeholder="Enter Address Line 2" name='address_line_2' value={formData.address_line_2} onChange={handleInputChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="City"
                                        name="city"
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
                                        rules={[{ required: true, message: 'Please input your State!' }]}
                                    >
                                        <Input name='state' value={formData.state} onChange={handleInputChange} placeholder="Enter State" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Pin Code"
                                        name="pin_code"
                                        rules={[{ required: true, message: 'Please input Pin Code!' }]}
                                    >
                                        <Input name='pin_code' value={formData.pin_code} onChange={handleInputChange} placeholder="Enter Pin Code" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}

                    {currentStep === 2 && (
                        <>

                            <Row gutter={16} className='mt-2'>
                                <Col span={12}>
                                    <Form.Item
                                        label="Account Holder Name"
                                        name="account_holder_name"
                                    >
                                        <Input name='account_holder_name' value={formData.account_holder_name}
                                            onChange={handleInputChange} placeholder="Enter Account Holder Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Account Number"
                                        name="account_number"
                                    >
                                        <Input name='account_number' value={formData.account_number}
                                            onChange={handleInputChange} placeholder="Enter Account Number" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16} className='mt-2'>
                                <Col span={12}>
                                    <Form.Item
                                        label="Bank Name"
                                        name="bank_name"
                                    >
                                        <Input name='bank_name' value={formData.bank_name}
                                            onChange={handleInputChange} placeholder="Enter Bank Name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="IFSC Code"
                                        name="ifsc_code"
                                    >
                                        <Input name='ifsc_code' value={formData.ifsc_code}
                                            onChange={handleInputChange} placeholder="Enter IFSC Code" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <Row gutter={16} className='mt-2'>
                                <Col span={8}>
                                    <Form.Item
                                        label="Hospital Registration Certificate"
                                        name="hospital_registration_certificate"
                                    >
                                        <Upload
                                            name="hospital_registration_certificate"
                                            fileList={formData.hospital_registration_certificate}
                                            onChange={handleFileChange('hospital_registration_certificate')}
                                            multiple
                                        >
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Hospital Pan Card"
                                        name="hospital_pan_card"

                                    >
                                        <Upload
                                            name="hospital_pan_card"
                                            fileList={formData.hospital_pan_card}
                                            onChange={handleFileChange('hospital_pan_card')}
                                            multiple
                                        >
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="CancelledCheque"
                                        name="cancelled_cheque"

                                    >
                                        <Upload
                                            name="cancelled_cheque"
                                            fileList={formData.cancelled_cheque}
                                            onChange={handleFileChange('cancelled_cheque')}
                                            multiple
                                        >
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>

                        </div>
                    )}
                    {currentStep === 4 && (
                        <div>
                            <h3>Summary</h3>
                            <p>Please review your details before submitting.</p>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Card title="Hospital Information">
                                        <p><strong>Account Type:</strong> {formData?.account_type}</p>
                                        <p><strong>Hospital Name:</strong> {formData?.first_name}</p>
                                        <p><strong>Hospital Phone Number:</strong> {formData?.phone_number}</p>
                                        <p><strong>Hospital Email:</strong> {formData?.email}</p>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title="Address Details">
                                        <p><strong>Address Line 1:</strong> {formData?.address_line_1}</p>
                                        <p><strong>Address Line 2:</strong> {formData?.address_line_2}</p>
                                        <p><strong>City:</strong> {formData?.city}</p>
                                        <p><strong>State:</strong> {formData?.state}</p>
                                        <p><strong>Pin Code:</strong> {formData?.pin_code}</p>
                                    </Card>
                                </Col>
                            </Row>
                            <Row gutter={16} className='mt-2'>
                                <Col span={12}>
                                    <Card title="Bank Details">
                                        <p><strong>Account Holder Name:</strong> {formData?.account_holder_name}</p>
                                        <p><strong>Account Number:</strong> {formData?.account_number}</p>
                                        <p><strong>Bank Name:</strong> {formData?.bank_name}</p>
                                        <p><strong>IFSC Code:</strong> {formData?.ifsc_code}</p>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title="Documents Uploaded">
                                        <p><strong>Hospital Registration Certificate:</strong> {formData?.hospital_registration_certificate?.length > 0 ? 'Uploaded' : 'Not Uploaded'}</p>
                                        <p><strong>Hospital PAN Card:</strong> {formData?.hospital_pan_card?.length > 0 ? 'Uploaded' : 'Not Uploaded'}</p>
                                        <p><strong>Cancelled Cheque:</strong> {formData?.cancelled_cheque?.length > 0 ? 'Uploaded' : 'Not Uploaded'}</p>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )}

                    <div style={{ marginTop: '20px' }}>
                        {currentStep > 0 && <Button onClick={prevStep}>Back</Button>}
                        {currentStep < 4 && <Button type="primary" onClick={nextStep} style={{ marginLeft: '8px' }}>Next</Button>}
                        {currentStep === 4 && <Button type="primary" htmlType="submit" style={{ marginLeft: '8px' }}>Submit</Button>}
                    </div>
                </Form>
            </div>
        </>

    );
};

export default HospitalForm;
