import React from 'react';
import { Col, Row, Statistic } from 'antd';
import { useAuth } from '@/context/AuthContext';

const { Countdown } = Statistic;

function Timer() {
    const { countdown, logout } = useAuth(); // Get countdown and logout function from AuthContext

    // Function to handle countdown finish
    const onFinish = () => {
        console.log('Session expired!');
        logout(); // Call logout when session expires
    };

    return (
        <div>
            <Row gutter={16}>
                <Col span={12}>
                    {countdown > 0 ? (
                        <Countdown
                            title="Session Expires In"
                            value={Date.now() + countdown * 1000} // Set the deadline based on remaining time
                            onFinish={onFinish}
                            format="HH:mm:ss" // Format to show hours, minutes, and seconds
                        />
                    ) : (
                        <span>Session Expired</span>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default Timer;
