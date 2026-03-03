// import React from "react";

// const AboutUs = () => {
//   return (
//     <div className=" mx-auto px-4 py-16 space-y-16 font-sans">

//       {/* Page Title */}
//       <h1 className="text-5xl font-bold text-center text-primary">About Us</h1>

//       {/* What We Do */}
//       <section className="bg-base-200 rounded-lg shadow-lg p-8 space-y-4">
//         <h2 className="text-3xl font-semibold text-secondary">What We Do</h2>
//         <p className="text-gray-700 text-lg">
//           We are a professional parcel and delivery service company committed to making logistics simple, fast, and reliable.
//           From sending packages to tracking deliveries, we provide a complete solution for individuals and businesses alike.
//         </p>
//       </section>

//       {/* Where We Service */}
//       <section className="bg-base-200 rounded-lg shadow-lg p-8 space-y-4">
//         <h2 className="text-3xl font-semibold text-secondary">Where We Service</h2>
//         <p className="text-gray-700 text-lg">
//           We operate nationwide, covering major cities, towns, and rural areas. No matter where you are, our services are designed 
//           to reach you quickly and efficiently. Our dedicated riders ensure parcels are delivered safely, even in hard-to-reach locations.
//         </p>
//       </section>

//       {/* How We Work */}
//       <section className="bg-base-200 rounded-lg shadow-lg p-8 space-y-4">
//         <h2 className="text-3xl font-semibold text-secondary">How We Work</h2>
//         <ol className="list-decimal list-inside space-y-3 text-gray-700 text-lg">
//           <li><span className="font-bold">Place Your Order:</span> Submit your parcel details through our website or app.</li>
//           <li><span className="font-bold">Assigning a Rider:</span> Our system matches your parcel with the nearest available rider.</li>
//           <li><span className="font-bold">Pickup & Delivery:</span> The rider collects the parcel and delivers it to the recipient on time.</li>
//           <li><span className="font-bold">Track in Real-Time:</span> You can track your parcel live through our dashboard at any moment.</li>
//         </ol>
//       </section>

//       {/* Working Policy */}
//       <section className="bg-base-200 rounded-lg shadow-lg p-8 space-y-4">
//         <h2 className="text-3xl font-semibold text-secondary">Our Working Policy</h2>
//         <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
//           <li>All parcels are handled with care and delivered safely.</li>
//           <li>We respect privacy and confidentiality of customer information.</li>
//           <li>Timely delivery is our priority. We strive to meet promised deadlines.</li>
//           <li>Customer support is available 24/7 for inquiries and complaints.</li>
//           <li>In case of lost or damaged parcels, we follow a clear compensation policy.</li>
//         </ul>
//       </section>

//       {/* Why Choose Us */}
//       <section className="bg-base-200 rounded-lg shadow-lg p-8 space-y-4">
//         <h2 className="text-3xl font-semibold text-secondary">Why Choose Us?</h2>
//         <p className="text-gray-700 text-lg">
//           With years of experience, dedicated staff, and a commitment to excellence, we are the preferred choice for parcel delivery.
//           We aim to make every delivery smooth, reliable, and hassle-free.
//         </p>
//       </section>

//     </div>
//   );
// };

// export default AboutUs;




import React from "react";
import { FaTruck, FaMapMarkerAlt, FaRegClock, FaHandsHelping } from "react-icons/fa";

const AboutUs = () => {
    return (
        <div className="mx-auto px-4 py-16 space-y-16 font-sans">

            {/* Page Hero */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold text-primary">About Us</h1>
                <p className="text-lg text-gray-600">
                    Delivering parcels with speed, care, and reliability nationwide.
                </p>
            </div>

            {/* What We Do */}
            <section className="bg-base-200 rounded-lg shadow-lg p-10 space-y-4 flex flex-col md:flex-row md:items-center md:gap-8">
                <FaTruck className="text-6xl text-primary mb-4 md:mb-0" />
                <div className="flex-1">
                    <h2 className="text-3xl font-semibold text-secondary mb-2">What We Do</h2>
                    <p className="text-gray-700 text-lg">
                        We provide fast, reliable, and secure parcel delivery for individuals and businesses.
                        From small packages to large shipments, we handle it all with care and professionalism.
                    </p>
                </div>
            </section>

            {/* Where We Service */}
            <section className="bg-base-200 rounded-lg shadow-lg p-10 space-y-4 flex flex-col md:flex-row md:items-center md:gap-8">
                <FaMapMarkerAlt className="text-6xl text-primary mb-4 md:mb-0" />
                <div className="flex-1">
                    <h2 className="text-3xl font-semibold text-secondary mb-2">Where We Service</h2>
                    <p className="text-gray-700 text-lg">
                        Our services cover major cities, towns, and rural areas. No matter your location, we ensure timely deliveries
                        using our network of experienced riders and logistics partners.
                    </p>
                </div>
            </section>

            {/* How We Work */}
            <section className="bg-base-200 rounded-lg shadow-lg p-10 space-y-4">
                <h2 className="text-3xl font-semibold text-secondary mb-4">How We Work</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-700 text-lg">
                    <li><span className="font-bold">Place Your Order:</span> Submit parcel details through our website or app.</li>
                    <li><span className="font-bold">Assigning a Rider:</span> System matches your parcel with the nearest available rider.</li>
                    <li><span className="font-bold">Pickup & Delivery:</span> Rider collects and delivers your parcel safely and on time.</li>
                    <li><span className="font-bold">Track in Real-Time:</span> Track your parcel live via our dashboard.</li>
                </ol>
            </section>

            {/* Working Policy */}
            <section className="bg-base-200 rounded-lg shadow-lg p-10 space-y-4 flex flex-col md:flex-row md:gap-8 md:items-start">
                <FaRegClock className="text-6xl text-primary mb-4 md:mb-0" />
                <div className="flex-1">
                    <h2 className="text-3xl font-semibold text-secondary mb-2">Our Working Policy</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
                        <li>All parcels are handled with care and delivered safely.</li>
                        <li>We respect privacy and confidentiality of customer information.</li>
                        <li>Timely delivery is our top priority. We meet promised deadlines.</li>
                        <li>Customer support is available 24/7 for inquiries and complaints.</li>
                        <li>In case of lost or damaged parcels, we follow a clear compensation policy.</li>
                    </ul>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-base-200 rounded-lg shadow-lg p-10 space-y-6 flex flex-col md:flex-row md:items-center md:gap-8">
                <FaHandsHelping className="text-6xl text-primary mb-4 md:mb-0" />
                <div className="flex-1 space-y-4">
                    <h2 className="text-3xl font-semibold text-secondary">Why Choose Us?</h2>
                    <p className="text-gray-700 text-lg">
                        With years of experience and a dedicated team, we ensure every delivery is smooth, reliable, and hassle-free.
                        Our technology-driven platform allows real-time tracking and updates for every parcel.
                    </p>
                    <a
                        href="/sendparcel"
                        className="btn btn-primary btn-lg mt-2"
                    >
                        Send a Parcel Now
                    </a>
                </div>
            </section>

        </div>
    );
};

export default AboutUs;