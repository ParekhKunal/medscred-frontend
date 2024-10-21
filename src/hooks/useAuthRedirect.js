
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const useAuthRedirect = (pageName) => {
    const { user, loading, token } = useAuth();
    const router = useRouter();
    const [permissions, setPermissions] = useState([]);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!token) {
            router.push('/auth/login');
            return;
        }

        if (!pageName) {
            setIsAuthorized(true);
            return;
        }

        const fetchPermissions = async () => {
            try {
                const response = await axios.get('http://localhost:5500/api/v1/auth/role-permission', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    setPermissions(response.data.data);
                } else {
                    console.error('Invalid permissions structure in response');
                    setPermissions([]);
                }
            } catch (error) {
                console.error('Error fetching permissions', error);
                router.push('/auth/login');
            }
        };

        fetchPermissions();
    }, [loading, token, user, router, pageName]);

    useEffect(() => {
        // Check if the user has permission to access the page
        if (permissions.length > 0) {
            const hasPermission = permissions.some((permission) => permission.name === pageName);
            setIsAuthorized(hasPermission);

            if (!hasPermission) {
                router.push('/unauthorized'); // Redirect to an "Unauthorized" page if no access
            }
        }
    }, [permissions, pageName, router]);

    return isAuthorized;
};

export default useAuthRedirect;
