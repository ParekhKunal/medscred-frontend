import React from 'react'
import { Avatar, Card, Flex, Switch, Col, Row, Statistic } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import Image from 'next/image';

const actions = [
    <EditOutlined key="edit" />,
    <SettingOutlined key="setting" />,
    <EllipsisOutlined key="ellipsis" />,
]

function Cards() {
    return (
        <div style={{ marginTop: 20 }}>
            <Row gutter={16}>
                <Col span={12}>
                    <Card bordered={false}>
                        <Statistic
                            title="Active"
                            value={11.28}
                            precision={2}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Cards
