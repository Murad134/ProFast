import React from 'react'
import merPic from '../../../assets/Anothr/location-merchant.png'
function BeMerchant() {
    return (
        <div data-aos='zoom-in-up' className="hero bg-[url('assets/be-a-merchant-bg.png')] bg-[#03373D] text-white rounded-4xl  p-20 ">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                    src={merPic}
                    className="max-w-sm rounded-lg shadow-2xl"
                />
                <div>
                    <h1 className="text-5xl font-bold">Merchant Customer Satisfaction is Our First Priority</h1>
                    <p className="py-6">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, saepe!
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis eveniet explicabo expedita saepe nesciunt tempora, sit ipsa perferendis hic labore.
                    </p>
                    <div className="flex flex-row">
                        <button className="btn btn-primary">Become a Merchant</button>
                        <button className="btn btn-outline btn-secondary ml-4">Earn with Profast Courier</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BeMerchant