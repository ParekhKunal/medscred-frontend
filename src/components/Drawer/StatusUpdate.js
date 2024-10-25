import React, { useState, useEffect } from 'react';
import { PlusOutlined, UserAddOutlined, InfoCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, notification, Typography, Upload } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Dragger } = Upload;
const { Title } = Typography;
const { Item: FormItem } = Form;

const statusTransitions = {
    1: [2],
    2: [3],
    3: [4],
    4: [5],
    5: [6],
    6: [7],
    7: [8],
    8: [9],
    9: []
};

function StatusUpdate({ token, currentStatus, hospitalId, onStatusUpdate, hospitalEmail }) {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [summary, setSummary] = useState('');
    const [password, setPassword] = useState('');
    const [hospitalStatusList, setHospitalStatusList] = useState([]);
    const [summaryLength, setSummaryLength] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [formData, setFormData] = useState({

        mou: null
    })

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        form.resetFields();
        setOpen(false);
        setSummary('');
        setSummaryLength(0);
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


    const handleFileChange = (fileType) => (info) => {
        setFormData((prevData) => ({
            ...prevData,
            [fileType]: info.fileList,
        }));
    };

    const handleFileRemove = (fileType) => (file) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fileType]: prevFormData[fileType].filter(item => item.uid !== file.uid),
        }));
    };

    const handleSubmit = async (values) => {
        try {

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

            submitData.append('permission_name', 'update_hospital');
            submitData.append('status', values.status);
            submitData.append('password', password);
            submitData.append('summary', summary);
            submitData.append('email', hospitalEmail);


            // Prepare data for submission
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hospitals/update-hospital-status/${hospitalId}`,
                submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Ensure multipart/form-data header is set
                },
            }
            );

            if (response.data && response.data.status === 'OK') {
                notification.success({
                    message: 'Status Updated',
                    description: `${response.data.message} ${values.status}.`,
                });
                onStatusUpdate();
                onClose();
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update status.',
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            notification.error({
                message: 'Error',
                description: 'An error occurred while updating the status.',
            });
        }
    };

    useEffect(() => {
        const fetchHospitalList = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hospitals/get-hospital-status-list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.status === 'OK') {
                    const validStatuses = statusTransitions[currentStatus] || [];
                    const filteredStatuses = response.data.data.filter(status => validStatuses.includes(status.id));
                    setHospitalStatusList(filteredStatuses);
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'Failed to fetch hospital list.',
                    });
                }
            } catch (error) {
                console.error('Error fetching hospital list:', error);
                notification.error({
                    message: 'Error',
                    description: 'An error occurred while fetching the hospital list.',
                });
            }
        };

        fetchHospitalList();
    }, [token, currentStatus]);



    const handleSummaryChange = (e) => {
        const value = e.target.value;
        if (value.length <= 250) {
            setSummary(value);
            setSummaryLength(value.length);
        }
    };

    const handlePassword = (e) => {
        const value = e.target.value;

        if (value.length <= 250) {
            setPassword(value);
        }
    };

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
    };



    return (
        <>
            <Button className="w-full " onClick={showDrawer} icon={<PlusOutlined />} type="primary">
                Update Status
            </Button>
            <Drawer
                title={<Title level={3}>Update Status</Title>}
                width={600}
                height={500}
                placement="bottom"
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" form="statusUpdateForm" htmlType="submit">
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form
                    id="statusUpdateForm"
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="status"
                                label={
                                    <span>
                                        <UserAddOutlined className="mr-1" />
                                        Status
                                    </span>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select the Status',
                                    },
                                ]}
                            >
                                <Select placeholder="Please select the Status" onChange={handleStatusChange}>
                                    {
                                        hospitalStatusList.map(status => (
                                            <Option key={status.id} value={status.id}>
                                                {status.status}
                                            </Option>
                                        ))}
                                </Select>
                            </Form.Item>
                            {selectedStatus === 8 && (
                                <Row gutter={16}>
                                    <Col span={12}>

                                        <Form.Item
                                            label="Hospital Email"
                                            name="hospitalEmail"
                                            initialValue={hospitalEmail}
                                        >
                                            <Input type="email" name='email' placeholder="Enter Hospital Email" disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Password" name="password">
                                            <Input.Password value={password} placeholder="Enter your password" onChange={handlePassword} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                            {
                                selectedStatus === 6 && (
                                    <Row gutter={16}>
                                        <Col span={24}>

                                            <Form.Item
                                                label="Hospital Email"
                                                name="hospitalEmail"
                                                initialValue={hospitalEmail}
                                            >
                                                <Input type="email" name='email' placeholder="Enter Hospital Email" disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <h1><span style={{ color: 'red' }}>*</span>MOU</h1>
                                            <Form.Item rules={[{ required: true, message: 'Please Upload The File' }]}>
                                                <Dragger {...uploadProps('mou')} style={{ width: '100%', height: '40px', padding: '20px' }}>
                                                    <p className="ant-upload-drag-icon">
                                                        <InboxOutlined />
                                                    </p>
                                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                    <p className="ant-upload-hint">Please upload MOU</p>
                                                </Dragger>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )
                            }
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="summary"
                                label={
                                    <span>
                                        <InfoCircleOutlined className="mr-1" />
                                        Summary
                                    </span>
                                }
                            >
                                <Input.TextArea maxLength={250} value={summary}
                                    onChange={handleSummaryChange} rows={4} placeholder="Please enter a Summary" />
                                <div className="text-right">
                                    <span>{summaryLength}/250</span>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
}

export default StatusUpdate;
