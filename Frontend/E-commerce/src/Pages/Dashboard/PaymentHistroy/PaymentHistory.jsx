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
        <div>
            <table className="table table-zebra w-full">
                <thead className="bg-base-200">
                    <tr>
                        <th>#</th>
                        <th>Parcel ID</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Transaction</th>
                        <th>Paid At</th>
                    </tr>
                </thead>

                <tbody>
                    {payments.map((payment, index) => (
                        <tr key={payment._id}>
                            <td>{index + 1}</td>

                            <td className="font-mono text-xs">
                                {payment.parcelId}
                            </td>

                            <td>
                                {payment.email}
                            </td>

                            <td className="font-semibold">
                                ৳ {payment.amount}
                            </td>

                            <td className="capitalize">
                                Card
                            </td>

                            <td className="font-mono text-xs text-blue-600">
                                {payment.transactionId}
                            </td>

                            <td>
                                {new Date(payment.paid_at).toLocaleString()}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default PaymentHistory