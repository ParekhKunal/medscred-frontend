import React, { useState, useEffect } from 'react'
import { Space, Table, Tag, Input } from 'antd';
const { Column, ColumnGroup } = Table;
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function HospitalsList({ hospitalData, datasize }) {

    const [searchText, setSearchText] = useState('');
    const router = useRouter();

    const pageSize = datasize

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    return (
        <>
            <Table dataSource={hospitalData} pagination={{ pageSize: pageSize }} className='w-[100%]'>
                <Column title="Name" dataIndex="first_name" key="firstName" filterMode="menu"
                    filterSearch={true}
                    filterDropdown={({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                        <div style={{ padding: 8 }}>
                            <Input
                                placeholder="Search Name"
                                value={selectedKeys[0]}
                                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => handleSearch(selectedKeys, confirm)}
                                style={{ marginBottom: 8, display: 'block' }}
                            />
                            <Space>
                                <button onClick={() => handleSearch(selectedKeys, confirm)} type="button">
                                    Search
                                </button> |
                                <button onClick={() => handleReset(clearFilters)} type="button">
                                    Reset
                                </button>
                            </Space>
                        </div>
                    )}
                    onFilter={(value, record) =>
                        record.first_name.toLowerCase().includes(value.toLowerCase())
                    }
                    filterIcon={(filtered) => (
                        <span><SearchOutlined style={{ color: 'rgba(0,0,0,.45)', fontSize: '20px' }} /></span>
                    )}
                />
                <Column title="email" dataIndex="email" key="email" render={(email) => (
                    <a href={`mailto:${email}`}>
                        {email}
                    </a>
                )}
                    filters={[
                        { text: 'Gmail', value: '@gmail.com' },
                        { text: 'Yahoo', value: '@yahoo.com' },
                        { text: 'Outlook', value: '@outlook.com' },
                    ]}
                    onFilter={(value, record) => record.email.includes(value)}
                    filterMode="menu"
                    filterSearch={true}
                    width='20%'
                />
                <Column title="Phone Number" dataIndex="phone_number" key="phone_number" />
                <Column
                    title="Account Type"
                    dataIndex="account_type"
                    key="account_type"
                    width='20%'
                    render={(accountTypeString) => {
                        if (!accountTypeString) {
                            return null;
                        }
                        // Split the string by commas and trim whitespace
                        const accountTypes = accountTypeString.split(',').map(type => type.trim());
                        return (
                            <>
                                {accountTypes.map((type) => {
                                    let color;
                                    // Assign colors based on account type
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
                                            {type.toUpperCase()} {/* Display type in uppercase */}
                                        </Tag>
                                    );
                                })}
                            </>
                        );
                    }}
                    filters={[
                        { text: 'REIMBURSEMENT', value: 'reimbursement' },
                        { text: 'CASHLESS', value: 'cashless' },
                        { text: 'ASTHETIC', value: 'aesthetic' },
                    ]}
                    onFilter={(value, record) => {
                        // Ensure record.account_type exists and is a string
                        if (typeof record.account_type === 'string') {
                            return record.account_type
                                .split(',')
                                .map(type => type.trim().toLowerCase())
                                .includes(value);
                        }
                        return false; // Return false if account_type is not a string
                    }}
                    filterMode="menu"
                    filterSearch={true}
                />
                <Column title="Status" dataIndex="status" key="status" filters={[
                    { text: 'Open Lead', value: 1 },
                    { text: 'Under Process', value: 2 },
                    { text: 'Documents Received', value: 3 },
                    { text: 'Document Verification', value: 4 },
                    { text: 'MOU Send', value: 5 },
                    { text: 'MOU Received', value: 6 },
                    { text: 'Verification', value: 7 },
                    { text: 'Onboarded', value: 8 },
                    { text: 'Deal Closed', value: 9 },
                    { text: 'All', value: null },
                ]}
                    onFilter={(value, record) => record?.status === value || value === null}
                    filterMode="menu"
                    filterSearch={true} />
                <Column
                    title="Action"
                    key="action"
                    render={(_, record) => (
                        <Space size="middle">
                            <a onClick={() => router.push(`/edit/hospitals/${record.admin_id}`)}><EditOutlined style={{ fontSize: '18px' }} /></a>
                            <a href="#"><DeleteOutlined style={{ fontSize: '18px' }} /></a>
                        </Space>
                    )}
                />
            </Table>
        </>
    )
}

export default HospitalsList
