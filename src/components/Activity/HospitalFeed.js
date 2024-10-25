'use clinet'

import React from 'react'
import { Row, Col, Card, Statistic, Calendar, Tooltip, Badge, Popover, List, Flex, Spin, Skeleton } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, UserAddOutlined, UserOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

function HospitalFeed({ loadingHospitalsFeed, hospitalDataFeed }) {

    const router = useRouter();


    return (
        <>
            <Card title="Activity Feed" style={{ height: '300px', overflow: 'auto', scrollbarWidth: 'thin' }}>
                {loadingHospitalsFeed ? (  // Conditional rendering based on loading state
                    <Skeleton active />  // Display a skeleton while loading
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={hospitalDataFeed}
                        renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    avatar={<UserAddOutlined />}  // Use correct syntax for JSX
                                    title={
                                        <>
                                            <a onClick={() => router.push(`/edit/hospitals/${item.hospital_id}`)}>
                                                {item.first_name}
                                            </a> - <strong>{item.name}</strong>
                                        </>
                                    }
                                    description={new Date(item.created_at).toLocaleString()} // Format the date
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </>
    )
}

export default HospitalFeed
