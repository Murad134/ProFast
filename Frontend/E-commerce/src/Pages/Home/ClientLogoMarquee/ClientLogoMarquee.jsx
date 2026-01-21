// src/components/clients/ClientLogos.jsx
import React from "react";
import Marquee from "react-fast-marquee";

// logo imports
import logo1 from "../../../assets/brands/amazon.png";
import logo2 from "../../../assets/brands/amazon_vector.png";
import logo3 from "../../../assets/brands/casio.png";
import logo4 from "../../../assets/brands/moonstar.png";
import logo5 from "../../../assets/brands/randstad.png";
import logo6 from "../../../assets/brands/star.png";
import logo7 from "../../../assets/brands/start_people.png";

const logos = [
    logo1,
    logo2,
    logo3,
    logo4,
    logo5,
    logo6,
    logo7,
];

export default function ClientLogos() {
    return (
        <section className="py-16 bg-base-100">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section title */}
                <h2 className="text-3xl text-primary font-bold text-center mb-12">
                    Trusted by Our Clients
                </h2>

                <Marquee
                    direction="left"
                    speed={40}
                    pauseOnHover={true}
                    gradient={false}
                >
                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className="mx-10 flex items-center justify-center"
                        >
                            <img
                                src={logo}
                                alt="Client logo"
                                className="h-6 w-auto  "
                            />
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}