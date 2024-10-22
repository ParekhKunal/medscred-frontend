import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';

function Header({ name, role }) {
    return (
        <div className="bg-white shadow-md py-4" style={{ marginTop: 10 }}>
            <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
                {/* Logo Section */}
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Hello, {name}</h1>
                </div>

                {/* Search and Button Section */}
                <div className="flex items-center space-x-4">
                    <Link href="/add/hospitals">
                        <Button className="rounded-lg" size="medium">
                            Add Hospitals
                        </Button>
                    </Link>
                    <Link href="/add/hospitals">
                        <Button className="rounded-lg" size="medium">
                            Add Patients
                        </Button>
                    </Link>
                    <Link href="/add/hospitals">
                        <Button className="rounded-lg" size="medium">
                            Add NBFC
                        </Button>
                    </Link>
                    <Link href="/add/hospitals">
                        <Button className="rounded-lg" size="medium">
                            Add Users
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
