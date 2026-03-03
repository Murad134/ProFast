import React from 'react'
import merPic from '../../../assets/Anothr/location-merchant.png'
function BeMerchant() {
    return (
        // <div data-aos='zoom-in-up' className="hero bg-[url('assets/be-a-merchant-bg.png')] bg-[#03373D] text-white rounded-4xl  p-20 ">
        //     <div className="hero-content flex-col lg:flex-row-reverse">
        //         <img
        //             src={merPic}
        //             className="max-w-sm rounded-lg shadow-2xl"
        //         />
        //         <div>
        //             <h1 className="text-5xl font-bold">Merchant Customer Satisfaction is Our First Priority</h1>
        //             <p className="py-6">
        //                 Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        //                 quasi. In deleniti eaque aut repudiandae et a id nisi.
        //                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, saepe!
        //                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis eveniet explicabo expedita saepe nesciunt tempora, sit ipsa perferendis hic labore.
        //             </p>
        //             <div className="flex flex-row">
        //                 <button className="btn btn-primary">Become a Merchant</button>
        //                 <button className="btn btn-outline btn-secondary ml-4">Earn with Profast Courier</button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div
            data-aos="zoom-in-up"
            className="hero bg-[#03373D] text-white rounded-4xl p-8 sm:p-12 lg:p-20 bg-cover bg-center"
            style={{ backgroundImage: `url('assets/be-a-merchant-bg.png')` }}
        >
            <div className="hero-content flex flex-col lg:flex-row-reverse items-center lg:items-start gap-8 lg:gap-12">

                {/* Image */}
                <img
                    src={merPic}
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-lg shadow-2xl"
                    alt="Merchant"
                />

                {/* Text Content */}
                <div className="text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                        Merchant Customer Satisfaction is Our First Priority
                    </h1>
                    <p className="py-4 sm:py-6 text-sm sm:text-base md:text-lg opacity-90">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, saepe!
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis eveniet explicabo expedita saepe nesciunt tempora, sit ipsa perferendis hic labore.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-4">
                        <button className="btn btn-primary w-full sm:w-auto">Become a Merchant</button>
                        <button className="btn btn-outline btn-secondary w-full sm:w-auto">Earn with Profast Courier</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default BeMerchant