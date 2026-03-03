import React from 'react'
import useAuth from '../../../hooks/useAuth.jsx';
import useAxiosSecure from '../../../hooks/useAxiosSecure.jsx';
import { useQuery } from '@tanstack/react-query';
function PaymentHistory() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { isPending, data: payments = [] } = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user?.email}`);
            return res.data;
        }
    })
    if (isPending) {
        return <span className="loading loading-spinner loading-xl"></span>;
    }

    return (
        // <div>
        //     <table className="table table-zebra w-full">
        //         <thead className="bg-base-200">
        //             <tr>
        //                 <th>#</th>
        //                 <th>Parcel ID</th>
        //                 <th>Email</th>
        //                 <th>Amount</th>
        //                 <th>Method</th>
        //                 <th>Transaction</th>
        //                 <th>Paid At</th>
        //             </tr>
        //         </thead>

        //         <tbody>
        //             {payments.map((payment, index) => (
        //                 <tr key={payment._id}>
        //                     <td>{index + 1}</td>

        //                     <td className="font-mono text-xs">
        //                         {payment.parcelId}
        //                     </td>

        //                     <td>
        //                         {payment.email}
        //                     </td>

        //                     <td className="font-semibold">
        //                         ৳ {payment.amount}
        //                     </td>

        //                     <td className="capitalize">
        //                         Card
        //                     </td>

        //                     <td className="font-mono text-xs text-blue-600">
        //                         {payment.transactionId}
        //                     </td>

        //                     <td>
        //                         {new Date(payment.paid_at).toLocaleString()}
        //                     </td>

        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>
        <div className="p-4">
            {/* Table wrapper for scroll on small devices */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-lg">
                    <thead className="bg-gray-100">
                        <tr className="text-left text-gray-700 uppercase text-sm tracking-wider">
                            <th className="px-4 py-3 text-blue-600 font-semibold">#</th>
                            <th className="px-4 py-3">Parcel ID</th>
                            <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3 hidden md:table-cell">Method</th>
                            <th className="px-4 py-3 hidden md:table-cell">Transaction</th>
                            <th className="px-4 py-3 hidden sm:table-cell">Paid At</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment, index) => (
                            <tr
                                key={payment._id}
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                                <td className="px-4 py-3 font-mono text-xs text-gray-700 break-all">
                                    {payment.parcelId}
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell text-sm text-gray-700 truncate max-w-xs">
                                    {payment.email}
                                </td>
                                <td className="px-4 py-3 font-semibold text-green-600">
                                    ৳ {payment.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell capitalize text-sm text-gray-700">
                                    Card
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-blue-600 break-all">
                                    {payment.transactionId}
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell text-sm text-gray-500">
                                    {new Date(payment.paid_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden mt-4 space-y-4">
                {payments.map((payment, index) => (
                    <div
                        key={payment._id}
                        className="bg-white p-4 rounded-lg shadow divide-y divide-gray-200"
                    >
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">#</span>
                            <span>{index + 1}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Parcel ID</span>
                            <span className="font-mono text-xs break-all">{payment.parcelId}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Email</span>
                            <span className="truncate max-w-xs">{payment.email}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Amount</span>
                            <span className="font-semibold text-green-600">৳ {payment.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Method</span>
                            <span className="capitalize">Card</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Transaction</span>
                            <span className="font-mono text-xs text-blue-600 break-all">{payment.transactionId}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="font-semibold text-gray-600">Paid At</span>
                            <span className="text-sm text-gray-500">{new Date(payment.paid_at).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default PaymentHistory