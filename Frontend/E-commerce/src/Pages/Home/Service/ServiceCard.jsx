import React from "react";

export default function ServiceCard({ service }) {
  const { icon: Icon, title, description } = service;

  return (
    // <div
    //   className="
    //     card bg-base-100
    //     shadow-md
    //     transition-all duration-300
    //     hover:bg-primary hover:text-primary-content
    //     hover:shadow-xl
    //   "
    // >
    //   <div className="card-body flex flex-col items-center text-center">
    //     {/* Icon */}
    //     <div className="text-5xl mb-4 transition-colors duration-300">
    //       <Icon />
    //     </div>

    //     {/* Title */}
    //     <h3 className="card-title text-lg font-semibold justify-center">
    //       {title}
    //     </h3>

    //     {/* Description */}
    //     <p className="text-sm opacity-90">
    //       {description}
    //     </p>
    //   </div>
    // </div>
    <div
      className="
    card bg-base-100
    shadow-md
    transition-all duration-300
    hover:bg-primary hover:text-primary-content
    hover:shadow-xl
    p-4 sm:p-6
  "
    >
      <div className="card-body flex flex-col items-center text-center">

        {/* Icon */}
        <div className="text-4xl sm:text-5xl md:text-6xl mb-1 transition-colors duration-300">
          <Icon />
        </div>

        {/* Title */}
        <h3 className="card-title text-lg sm:text-xl md:text-2xl font-semibold justify-center mb-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg opacity-90">
          {description}
        </p>

      </div>
    </div>
  );
}
