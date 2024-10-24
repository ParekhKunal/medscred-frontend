'use client'

import './navbar.css'
import React, { useState } from 'react'
import Link from 'next/link';
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react'
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import Image from 'next/image';
import { Dropdown, Avatar, Menu } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, UserAddOutlined, UserOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';





function Menubar({ role }) {

    const { logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleMenuClick = (e) => {
        console.log('Click on menu item:', e);
        if (e.key === "3") {
            logout();
        }
    };

    const profileMenu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">
                <Link href="/profile">View Profile</Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link href="/settings">Settings</Link>
            </Menu.Item>
            <Menu.Item key="3">
                <a onClick={(e) => e.preventDefault()}>Logout</a>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <header className="bg-white shadow-sm">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        {role === 1 &&
                            <Link href="/admin" className="-m-1.5 p-1.5">
                                <span className="sr-only">MedsCred</span>
                                <Image
                                    alt=""
                                    src="/assets/images/logo.png"
                                    height={50}
                                    width={130}
                                    className=""
                                />
                            </Link>
                        }
                        {role === 2 &&
                            <Link href="/sales" className="-m-1.5 p-1.5">
                                <span className="sr-only">MedsCred</span>
                                <Image
                                    alt=""
                                    src="/assets/images/logo.png"
                                    height={50}
                                    width={130}
                                    className=""
                                />
                            </Link>
                        }
                        {role === 3 &&
                            <Link href="/tpa" className="-m-1.5 p-1.5">
                                <span className="sr-only">MedsCred</span>
                                <Image
                                    alt=""
                                    src="/assets/images/logo.png"
                                    height={50}
                                    width={130}
                                    className=""
                                />
                            </Link>
                        }
                        {role === 4 &&
                            <Link href="/partner" className="-m-1.5 p-1.5">
                                <span className="sr-only">MedsCred</span>
                                <Image
                                    alt=""
                                    src="/assets/images/logo.png"
                                    height={50}
                                    width={130}
                                    className=""
                                />
                            </Link>
                        }
                        {role === 5 &&
                            <Link href="/bfc" className="-m-1.5 p-1.5">
                                <span className="sr-only">MedsCred</span>
                                <Image
                                    alt=""
                                    src="/assets/images/logo.png"
                                    height={50}
                                    width={130}
                                    className=""
                                />
                            </Link>
                        }
                        {role === 6 &&
                            <Link href="/hr" className="-m-1.5 p-1.5">
                                <span className="sr-only">MedsCred</span>
                                <Image
                                    alt=""
                                    src="/assets/images/logo.png"
                                    height={50}
                                    width={130}
                                    className=""
                                />
                            </Link>
                        }

                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                        {role === 1 && (
                            <>
                                <Link href='/admin' className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Dashboard
                                </Link>
                                <Link href="/view/hospitals" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Hospital
                                </Link>
                                <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Patients
                                </a>
                                <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    NBFC
                                </a>
                                <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Loans
                                </a>
                                <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Users
                                </a>
                            </>
                        )}
                        {role === 2 && (
                            <>
                                <Link href='/sales' className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Dashboard
                                </Link>
                                <Link href="/view/hospitals" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Hospital
                                </Link>
                                <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Patients
                                </a>
                            </>
                        )}
                        {role === 3 && (
                            <>
                                <Link href='/tpa' className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Dashboard
                                </Link>
                                <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Patients
                                </a>
                            </>
                        )}
                        {role === 4 && (
                            <>
                                <Link href='/partner' className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Dashboard
                                </Link>
                                <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Patients
                                </a>
                            </>
                        )}
                        {role === 5 && (
                            <>
                                <Link href='/nbfc' className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Dashboard
                                </Link>
                                <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Patients
                                </a>
                            </>
                        )}
                        {role === 6 && (
                            <>
                                <Link href='/hr' className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Dashboard
                                </Link>
                                <Link href="/view/hospitals" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    Hospital
                                </Link>
                                <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                    User
                                </a>
                            </>
                        )}
                    </PopoverGroup>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <Dropdown overlay={profileMenu} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()} style={{ background: '#CEF7F3', padding: 10, borderRadius: '50%' }}>
                                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#CEF7F3', color: '#09D7C3', borderColor: '#09D7C3', borderWidth: '1px' }} />
                            </a>
                        </Dropdown>
                    </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-10" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <Image width={50} height={50}
                                    alt=""
                                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                                    className="h-8 w-auto"
                                />
                            </a>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {/* <Disclosure as="div" className="-mx-3">
                                        <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                            Product
                                            <ChevronDownIcon aria-hidden="true" className="h-5 w-5 flex-none group-data-[open]:rotate-180" />
                                        </DisclosureButton>
                                        <DisclosurePanel className="mt-2 space-y-2">
                                            {[...products, ...callsToAction].map((item) => (
                                                <DisclosureButton
                                                    key={item.name}
                                                    as="a"
                                                    href={item.href}
                                                    className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                >
                                                    {item.name}
                                                </DisclosureButton>
                                            ))}
                                        </DisclosurePanel>
                                    </Disclosure> */}
                                    {role === 1 && (
                                        <>
                                            <Link href='/admin' className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Dashboard
                                            </Link>
                                            <Link href="/view/hospitals" className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Hospital
                                            </Link>
                                            <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Patients
                                            </a>
                                            <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                                NBFC
                                            </a>
                                            <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Loans
                                            </a>
                                            <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Users
                                            </a>
                                        </>
                                    )}
                                    {role === 2 && (
                                        <>
                                            <Link href='/sales' className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Dashboard
                                            </Link>
                                            <Link href="/view/hospitals" className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Hospital
                                            </Link>
                                            <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Patients
                                            </a>
                                        </>
                                    )}
                                    {role === 3 && (
                                        <>
                                            <Link href='/tpa' className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Dashboard
                                            </Link>
                                            <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Patients
                                            </a>
                                        </>
                                    )}
                                    {role === 4 && (
                                        <>
                                            <Link href='/partner' className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Dashboard
                                            </Link>
                                            <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Patients
                                            </a>
                                        </>
                                    )}
                                    {role === 5 && (
                                        <>
                                            <Link href='/nbfc' className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Dashboard
                                            </Link>
                                            <a href="#" className="text-sm font-normal leading-6 text-[#008AFF]">
                                                Patients
                                            </a>
                                        </>
                                    )}
                                    <hr />
                                    <a
                                        href="#"
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-normal leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        My Profile
                                    </a>
                                </div>
                            </div>

                        </div>
                    </DialogPanel>
                </Dialog>
            </header >
        </>
    )
}

export default Menubar
