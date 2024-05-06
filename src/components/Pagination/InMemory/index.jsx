import React from 'react';
import Form from 'react-bootstrap/Form';
import './index.scss';

const Pagination = ({ currentPage, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange }) => {
  const maxPages = Math.ceil(totalItems / itemsPerPage);

  const pages = [];
  for (let i = 1; i <= maxPages; i++) {
    pages.push(
      <span
        key={i}
        style={{ cursor: 'pointer', fontWeight: i === currentPage ? 'bold' : 'normal', margin: '0 5px' }}
        onClick={() => onPageChange(i)}
      >
        {i}
      </span>
    );
  }

  const nextPage = () => {
    if (currentPage < maxPages) {
      onPageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="pagination">
      <div>
        <Form.Select
          value={itemsPerPage}
          onChange={e => onItemsPerPageChange(parseInt(e.target.value))}
          style={{ width: '200px', border: 'none' }}
        >
          <option value="5">Results per page: 5</option>
          <option value="10">Results per page: 10</option>
          <option value="15">Results per page: 15</option>
        </Form.Select>
      </div>
      <div>
        <span style={{ cursor: 'pointer' }} onClick={prevPage} disabled={currentPage === 1}>{'< '}</span>
        {pages}
        <span style={{ cursor: 'pointer' }} onClick={nextPage} disabled={currentPage === maxPages}>{' >'}</span>
      </div>
      <div />
    </div>
  );
};

export default Pagination;