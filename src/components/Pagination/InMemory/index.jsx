import React from 'react';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import './index.scss';

const Pagination = ({ currentPage, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange }) => {
  const maxPages = Math.ceil(totalItems / itemsPerPage);

  const pageNumbers = Array.from({ length: maxPages }, (_, i) => (
    <span
      key={i + 1}
      className={`page-number ${i + 1 === currentPage ? 'active' : ''}`}
      onClick={() => onPageChange(i + 1)}
    >
      {i + 1}
    </span>
  ));

  const handlePageChange = (newPage) => {
    if(newPage > 0 && newPage <= maxPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="pagination">
      <div>
        <Form.Select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value, 10))}
          className="page-selector"
        >
          <option value="5">Results per page: 5</option>
          <option value="10">Results per page: 10</option>
          <option value="15">Results per page: 15</option>
        </Form.Select>
      </div>
      <div>
        <span
          className={`page-control ${currentPage === 1 ? 'dimmed' : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="chevronLeft" />
        </span>
        {pageNumbers}
        <span
          className={`page-control ${currentPage === maxPages ? 'dimmed' : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FontAwesomeIcon icon={faChevronRight} className="chevronRight" />
        </span>
      </div>
      <div />
    </div>
  );
};

export default Pagination;
