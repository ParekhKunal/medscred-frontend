'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import { Row, Col, Card, Statistic, Calendar, Tooltip, Badge, Popover, List, Flex, Spin } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, UserAddOutlined, UserOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar/Navbar';
import HospitalsList from '@/components/DataGrid/HospitalsList';
import Header from '@/components/Header/Header';

// Sample event data
const events = [
    { date: '2024-10-21', type: 'birthday', name: 'John Doe' },
    { date: '2024-10-31', type: 'holiday', name: 'Halloween' },
    { date: '2024-12-25', type: 'holiday', name: 'Christmas' },
];

const activityData = [
    {
        id: 1,
        content: 'User John Doe added a new hospital.',
        icon: <UserAddOutlined />,
        timestamp: '2 minutes ago'
    },
    {
        id: 2,
        content: 'Hospital XYZ updated their contact information.',
        icon: <EditOutlined />,
        timestamp: '10 minutes ago'
    },
    {
        id: 3,
        content: 'New user registration for Dr. Smith.',
        icon: <UserOutlined />,
        timestamp: '30 minutes ago'
    }
];


// Function to get events for a specific date
const getEventList = (date) => {
    return events.filter(event => event.date === date.format('YYYY-MM-DD')); // Use moment to format the date
};

// Date cell rendering function
const dateCellRender = (value) => {
    const eventList = getEventList(value);
    return (
        <div style={{ textAlign: 'center' }}>
            {eventList.length > 0 && (
                <Tooltip title={eventList.map(event => event.type === 'birthday' ? `${event.name}'s Birthday` : event.name).join(', ')}>
                    <Badge count={eventList.length} style={{ backgroundColor: '#52c41a' }} />
                </Tooltip>
            )}
        </div>
    );
};

function Sales() {

    useAuthRedirect('dashboard');

    const { user, loading, token } = useAuth();
    const [hospitalData, setHospitalData] = useState([]);
    const [loadingHospitals, setLoadingHospitals] = useState(true);
    const router = useRouter();


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

                setHospitalData(data.data);
            } catch (error) {
                console.error('Error fetching hospitals:', error);
            }
        };

        if (token) {
            fetchHospitalList(); // Trigger API call if token is available
        }
    }, [token]);

    if (loading) return <div className='flex justify-center w-full h-screen items-center'><Flex><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></Flex></div>;

    return (
        <>
            <Navbar role={user?.data?.role} />
            <div className="min-h-screen flex flex-col p-6 bg-gray-100">
                <Header name={user?.data?.first_name} role={user?.data?.role} />
                <Row gutter={16} style={{ marginTop: '20px' }}>
                    <Col span={18}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card>
                                    <Statistic precision={2}
                                        valueStyle={{
                                            color: '#3f8600',
                                        }}
                                        prefix={<ArrowUpOutlined />} title="Total Hospitals" value={hospitalData.length} />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic precision={2}
                                        valueStyle={{
                                            color: '#3f8600',
                                        }}
                                        prefix={<ArrowUpOutlined />} title="Pending Requests" value={12} />
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic precision={2}
                                        valueStyle={{
                                            color: '#3f8600',
                                        }}
                                        prefix={<ArrowUpOutlined />} title="Active Users" value={30} />
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginTop: '20px' }}>
                            <Col span={24}>
                                <Card title="Activity Feed" style={{ height: '300px', overflow: 'auto', scrollbarWidth: 'thin' }}>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={activityData}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={item.icon}
                                                    title={item.content}
                                                    description={item.timestamp}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={6}>
                        <Card title="Calendar" style={{ height: '100%' }}>
                            <Calendar dateCellRender={dateCellRender} fullscreen={false} />
                        </Card>
                    </Col>
                </Row>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <HospitalsList hospitalData={hospitalData} datasize={5} />
                </div>
            </div>
        </>
    )
}

export default Sales
