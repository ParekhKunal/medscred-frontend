import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

function Header({ name, role }) {
    return (
        <div className="bg-white shadow-md py-4" style={{ marginTop: 10 }}>
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 lg:px-8">
                {/* Logo Section */}
                <div className="flex items-center mb-4 sm:mb-0">
                    <h1 className="text-2xl font-semibold text-gray-800">Hello, {name}</h1>
                </div>

                {/* Search and Button Section */}
                <div className="flex flex-wrap items-center justify-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
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
