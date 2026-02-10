// import { useQuery } from '@tanstack/react-query';
// import useAuth from './useAuth';
// import useAxiosSecure from './useAxiosSecure';

// const useUserRole = () => {
//     const { user, loading } = useAuth();
//     const axiosSecure = useAxiosSecure();

//     const {
//         data: role = 'user',
//         isLoading,
//         isError,
//         refetch,
//     } = useQuery({
//         queryKey: ['user-role', user?.email],
//         enabled: !!user?.email && !loading,
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/users/${user.email}/role`);
//             return res.data;
//         },
//     });
//     return {
//         role,
//         isLoading,
//         isError,
//         refetch,
//     };
// };

// export default useUserRole;


import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        data = { role: 'user' }, // ✅ default object
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email && !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data; // { role: 'admin' }
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

