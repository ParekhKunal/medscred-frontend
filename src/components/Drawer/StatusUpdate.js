import React, { useState, useEffect } from 'react';
import { PlusOutlined, UserAddOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, Row, Select, Space, notification, Typography } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Title } = Typography;

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

function StatusUpdate({ token, currentStatus, hospitalId, onStatusUpdate }) {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [summary, setSummary] = useState('');
    const [hospitalStatusList, setHospitalStatusList] = useState([]);
    const [summaryLength, setSummaryLength] = useState(0);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        form.resetFields();
        setOpen(false);
        setSummary('');
        setSummaryLength(0);
    };

    const handleSubmit = async (values) => {
        try {
            // Prepare data for submission
            const response = await axios.post(`http://localhost:5500/api/v1/hospitals/update-hospital-status/${hospitalId}`, {
                status: values.status,
                summary: summary,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data && response.data.status === 'OK') {
                notification.success({
                    message: 'Status Updated',
                    description: `Status updated successfully for ${values.status}.`,
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
                const response = await axios.get('http://localhost:5500/api/v1/hospitals/get-hospital-status-list', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(response.data.data);

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
    }, [currentStatus]);

    const handleSummaryChange = (e) => {
        const value = e.target.value;
        if (value.length <= 250) {
            setSummary(value);
            setSummaryLength(value.length);
        }
    };

    return (
        <>
            <Button className="w-full" onClick={showDrawer} icon={<PlusOutlined />} type="primary">
                Update Status
            </Button>
            <Drawer
                title={<Title level={3}>Update Status</Title>}
                width={600}
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
                                <Select placeholder="Please select the Status">
                                    {
                                        hospitalStatusList.map(status => (
                                            <Option key={status.id} value={status.id}>
                                                {status.status}
                                            </Option>
                                        ))}
                                </Select>
                            </Form.Item>
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
