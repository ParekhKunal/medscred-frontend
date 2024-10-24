'use client'
import React from 'react'
import { Button } from 'antd'
import { InfoCircleOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

function Notification({ currentStatus }) {
    let message, icon, bgColor, textColor;
    switch (currentStatus) {
        case 1:
            message = "Basic Details Uploaded without doc please contact the ";
            icon = <InfoCircleOutlined className="mr-2" />;
            bgColor = 'bg-red-500';
            textColor = 'text-white';
            break;
        case 2:
            message = "HR & Operations & Sales Teams Are Request To Send the Document Upload Link to hospital provided above";
            icon = <InfoCircleOutlined className="mr-2" />;
            bgColor = 'bg-red-500';
            textColor = 'text-white';
            break;
        case 3:
            message = "Documents Received";
            icon = <InfoCircleOutlined className="mr-2" />;
            bgColor = 'bg-red-500';
            textColor = 'text-white';
            break;
        case 4:
            message = "HR & Operations Teams Are Request To Review The Hospital Details & Doc";
            icon = <InfoCircleOutlined className="mr-2" />;
            bgColor = 'bg-red-500';
            textColor = 'text-white';
            break;
        case 5:
            message = "Need to Send MOU, Update the Status";
            icon = <CheckCircleOutlined className="mr-2" />;
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            break;
        case 6:
            message = "MOU Received Manually via mail please update in the Portal";
            icon = <WarningOutlined className="mr-2" />;
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            break;
        case 7:
            message = "Document Verification Stage";
            icon = <WarningOutlined className="mr-2" />;
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            break;
        case 8:
            message = "Email & Password Sending Stage Update the Status it will be share automatically";
            icon = <WarningOutlined className="mr-2" />;
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            break;
        case 6:
            message = "Completely Onboarded";
            icon = <WarningOutlined className="mr-2" />;
            bgColor = 'bg-gree-100';
            textColor = 'text-yellow-800';
            break;
        default:
            message = "Dr. XYZ has some unverified information.";
            icon = <InfoCircleOutlined className="mr-2" />;
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            break;
    }

    return (
        <div className={`flex justify-between items-center ${bgColor} ${textColor} p-4 mb-6 rounded-md`}>
            <span className="flex items-center">
                {icon}
                {message}
            </span>
        </div>
    )
}

export default Notification
