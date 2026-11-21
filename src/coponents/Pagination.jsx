import React from "react";
import { useSelector } from "react-redux";

function Pagination({
  currentPage,
  onPageChange,
  nextPageText = "Next",
  prevPageText = "Prev",
  firstPageText = "1st",
  lastPageText = "Last",
}) {
  const { totalPages, products } = useSelector((state) => state.product);

  if (products.length === 0 || totalPages <= 1) return null;

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 2;

    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++
    ) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const buttonClasses =
    "px-2.5 py-1.5 md:px-3 md:py-2 text-[0.9rem] md:text-base font-bold rounded border transition-all duration-300 ease-in-out";

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 p-2 md:p-2.5 rounded-lg mt-16 md:mt-[100px]">
      {/* First & Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className={`${buttonClasses}
          ${
            currentPage === 1
              ? "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] cursor-not-allowed shadow-none"
              : "text-black border-gray-400 cursor-pointer hover:bg-[var(--primary-main)] hover:text-[var(--text-light)] hover:shadow-md"
          }`}
      >
        {firstPageText}
      </button>

      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${buttonClasses}
          ${
            currentPage === 1
              ? "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] cursor-not-allowed shadow-none"
              : "text-black border-gray-400 cursor-pointer hover:bg-[var(--primary-main)] hover:text-[var(--text-light)] hover:shadow-md"
          }`}
      >
        {prevPageText}
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          disabled={currentPage === number}
          className={`${buttonClasses}
            ${
              currentPage === number
                ? "bg-[var(--primary-dark)] text-white text-[var(--text-primary)] border-[var(--primary-main)] cursor-default shadow-sm"
                : "text-black border-gray-400 cursor-pointer hover:bg-[var(--primary-main)] hover:text-[var(--text-light)] hover:shadow-md"
            }`}
        >
          {number}
        </button>
      ))}

      {/* Next & Last */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${buttonClasses}
          ${
            currentPage === totalPages
              ? "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] cursor-not-allowed shadow-none"
              : "text-black border-gray-400 cursor-pointer hover:bg-[var(--primary-main)] hover:text-[var(--text-light)] hover:shadow-md"
          }`}
      >
        {nextPageText}
      </button>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className={`${buttonClasses}
          ${
            currentPage === totalPages
              ? "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] cursor-not-allowed shadow-none"
              : "text-black border-gray-400 cursor-pointer hover:bg-[var(--primary-main)] hover:text-[var(--text-light)] hover:shadow-md"
          }`}
      >
        {lastPageText}
      </button>
    </div>
  );
}

export default Pagination;