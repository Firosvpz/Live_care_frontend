import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex justify-center items-center mt-6 space-x-2 text-center ">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-[#2F76FF] bg-white border border-[#2F76FF] rounded-md hover:bg-[#EEF5FF] transition-colors duration-300 
                disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const pageNumber = i + 1;
        const isCurrentPage = currentPage === pageNumber;
        const isNearCurrentPage = Math.abs(currentPage - pageNumber) <= 1;

        if (
          isCurrentPage ||
          isNearCurrentPage ||
          pageNumber === 1 ||
          pageNumber === totalPages
        ) {
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
                isCurrentPage
                  ? "bg-[#2F76FF] text-white"
                  : "text-[#142057] bg-white border border-[#2F76FF] hover:bg-[#EEF5FF]"
              }`}
            >
              {pageNumber}
            </button>
          );
        } else if (
          pageNumber === currentPage - 2 ||
          pageNumber === currentPage + 2
        ) {
          return (
            <span key={pageNumber} className="px-2">
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2  text-sm font-medium text-[#2F76FF] bg-white border border-[#2F76FF] rounded-md hover:bg-[#EEF5FF] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
