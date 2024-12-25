import React from 'react';
import { Button, Typography, ButtonGroup } from '@mui/joy';

const Pagination = ({ totalClients, clientsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalClients / clientsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Generate pagination numbers based on currentPage
  const generatePagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Number of visible page buttons
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(currentPage + halfVisible, totalPages);

    // Adjust start and end pages if we are near the edges
    if (startPage === 1) {
      endPage = Math.min(maxVisiblePages, totalPages);
    }
    if (endPage === totalPages) {
      startPage = Math.max(totalPages - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={i === currentPage ? 'solid' : 'soft'}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <Button
        variant="soft"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      <ButtonGroup variant="outlined" size="sm">
        {generatePagination()}
      </ButtonGroup>

      <Button
        variant="soft"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
