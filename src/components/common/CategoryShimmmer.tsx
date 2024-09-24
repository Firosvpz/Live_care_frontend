import React from "react";

const CategoryShimmer: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg animate-pulse"
        >
          <div className="p-4 border-b border-gray-300">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {[1, 2, 3].map((_, techIndex) => (
                <div
                  key={techIndex}
                  className="h-4 bg-gray-300 rounded w-1/4"
                ></div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryShimmer;