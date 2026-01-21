import React from "react";

export default function BenefitHorizontalCard({ image, title, description }) {
  return (
    <div className="card card-side bg-base-100 shadow-md hover:shadow-lg transition">
      {/* Left Image */}
      <figure className="w-40 flex items-center justify-center bg-base-200">
        <img
          src={image}
          alt={title}
          className="w-20 h-20 object-contain"
        />
      </figure>

      {/* Divider */}
      <div className="divider divider-horizontal m-0"></div>

      {/* Right Content */}
      <div className="card-body flex-1">
        <h3 className="card-title text-primary">
          {title}
        </h3>
        <p className="text-sm text-base-content/80">
          {description}
        </p>
      </div>
    </div>
  );
}
