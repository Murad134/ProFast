import React from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
function PaymentForm() {

    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();

    const { id } = useParams();

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

    const amountInCents = amount * 100;
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
        }
    }
    return (
        <div>
            <Form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto'>
                <CardElement className='p-2 border rounded' />
                <button className='btn btn-primary w-full'
                    type='submit'
                    disabled={!stripe}>
                    Pay ${amount}
                </button>
                {
                    error && <p className='text-red-500'>{error}</p>
                }
            </Form>
        </div>
    )
}
export default PaymentForm