
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxios from './useAxios';

const useUserRole = () => {
    const { user, loading } = useAuth();
    const axiosInstance = useAxios();
    const {
        data = { role: 'user' },
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email && !loading,
        retry: false,
        queryFn: async () => {
            // const res = await axiosSecure.get(`/users/${user.email}/role`);
            try {
                const res = await axiosInstance.get(`/users/role?email=${user.email}`);
                return res.data; // { role: 'admin' }
            } catch (error) {
                console.error('Failed to load user role, falling back to user:', error);
                return { role: 'user' };
            }
        },
    });

    return {
        role: data.role, // ✅ ALWAYS string ('admin' | 'user' | 'rider')
        isLoading,
        isError,
        refetch,
    };
};

export default useUserRole;

