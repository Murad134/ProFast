import React from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ ADDED: useNavigate
import { Form } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

function PaymentForm() {
    const { user } = useAuth();
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { id } = useParams();
    const navigate = useNavigate();

    const [error, setError] = useState();

    // Fetch parcel details (if needed) for payment processing
    const { isPending, data: parcelInfo = {} } = useQuery({
        queryKey: ['parcel', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${id}`);
            return res.data;
        }
    })

    if (isPending) {
        return <span className="loading loading-spinner loading-xl"></span>;
    }

    console.log(parcelInfo);
    const amount = parcelInfo?.data?.DeliveryCost;
    const amountInCents = amount;
    console.log(amountInCents);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card == null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: card,
        })

        if (error) {
            setError(error.message);
        }
        else {
            setError('');
            console.log('PaymentMethod', paymentMethod);

            // step-2 Create payment intent on the server
            const res = await axiosSecure.post('/create-payment-intent', {
                amountInCents,
                id
            })

            // step-3 confirm card payment
            const clientSecret = res.data.clientSecret;
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        //email: user?.email,
                        name: 'John Doe',
                    },
                }
            });

            if (result.error) {
                setError(result.error.message);
            }
            else {
                setError('');
                if (result.paymentIntent.status === 'succeeded') {
                    // Payment succeeded, update the order status on the server
                    console.log('Payment succeeded!');
                    const transactionId = result.paymentIntent.id;

                    // step -4 mark parcel paid also create payment history (after creating backend))
                    const paymentData = {
                        parcelId: id,
                        email: user?.email,
                        amount,
                        transactionId: result.paymentIntent.id,
                        paymentMethod: result.paymentIntent.payment_method,
                    }


                    const paymentRes = await axiosSecure.post('/payments', paymentData);
                    if (paymentRes.data.insertedId) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful',
                            html: `<strong>Transaction ID:</strong><code>${transactionId}</code>`,
                            confirmButtonText: 'Go to My Parcels',
                            allowOutsideClick: false,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate('/dashboard/myparcels');
                            }
                        });
                    }
                    console.log('res from intent', res);
                }
            }
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto'>
                <CardElement className='p-2 border rounded' />
                <button
                    className='btn btn-primary w-full'
                    type='submit'
                    disabled={!stripe}
                >
                    Pay ${amount}
                </button>
                {error && <p className='text-red-500'>{error}</p>}
            </Form>
        </div>
    )
}
export default PaymentForm;