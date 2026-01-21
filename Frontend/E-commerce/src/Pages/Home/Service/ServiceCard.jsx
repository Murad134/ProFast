// // src/components/services/ServiceCard.jsx
// import React from "react";

// export default function ServiceCard({ service }) {
//   const { icon: Icon, title, description } = service;

//   return (
//     <div className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300">
//       <div className="card-body items-center text-center">
//         <div className="text-primary text-4xl mb-4">
//           <Icon />
//         </div>

//         <h3 className="card-title text-lg font-semibold">
//           {title}
//         </h3>

//         <p className="text-sm text-gray-600">
//           {description}
//         </p>
//       </div>
//     </div>
//   );
// }


// src/components/services/ServiceCard.jsx
import React from "react";

export default function ServiceCard({ service }) {
  const { icon: Icon, title, description } = service;

  return (
    <div
      className="
        card bg-base-100
        shadow-md
        transition-all duration-300
        hover:bg-primary hover:text-primary-content
        hover:shadow-xl
      "
    >
      <div className="card-body flex flex-col items-center text-center">
        {/* Icon */}
        <div className="text-5xl mb-4 transition-colors duration-300">
          <Icon />
        </div>

        {/* Title */}
        <h3 className="card-title text-lg font-semibold justify-center">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm opacity-90">
          {description}
        </p>
      </div>
    </div>
  );
}
