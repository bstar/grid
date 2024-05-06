import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Pagination from '../Pagination/InMemory/index.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faSearch } from '@fortawesome/free-solid-svg-icons';
import data from '../../seeds/bad_data.json';
import './index.scss';

const CLAGrid = () => {
  const [items, setItems] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [collapse, setCollapse] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Apply search filter on the entire dataset
  const filteredData = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Slice the filtered data for current page display
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const sumValues = (obj) => {
    return obj.reduce((acc, curr) => acc + curr, 0);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    const sortedItems = [...filteredData].sort((a, b) => {
      if (newOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setItems(sortedItems);
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <Card className="viewContainer">
      <div className="gridHeader">
        {/* Header content here */}
      </div>
      
      <div className="teamMembers">
        <div>Team Members <span className="teamMembersTotal">{totalItems} Total</span></div>
        <div className="teamMembers">
          <>
            {isSearchVisible && (
              <div style={{ marginRight: '15px' }}>
                <input
                  type="text"
                  placeholder="Search by worker"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="searchField"
                />
              </div>
            )}
            <FontAwesomeIcon
              icon={faSearch}
              onClick={toggleSearchVisibility}
              className="searchToggle"
              style={{ opacity: isSearchVisible ? 0.5 : 1 }}
            />
          </>
          <div className="sortToggle" onClick={handleSortToggle}>
            {sortOrder === 'asc' ? 'Sort Z - A' : 'Sort A - Z'}
          </div>
          <div className="collapseToggle" onClick={handleCollapse}>{collapse ? 'Expand Section' : 'Collapse Section'}</div>
        </div>
      </div>
      
      {!collapse && (
        <Container className="teamContainer">
          {currentItems.map((item, index) => (
            <Row key={`row_${index}`} className="row">
              <Col style={{ minWidth: '400px' }}>{item.name}</Col>
              <Col xs={6} className="colHours">
                <div style={{ marginRight: '30px', paddingBottom: '15px' }}>{sumValues(item.val)} Hours</div>
                <div>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </div>
              </Col>
              {item.val.map((hour, idx) => (
                <Col className="colDecoration" key={`col_${idx}`}>{hour}</Col>
              ))}
            </Row>
          ))}

          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </Container>
      )}
    </Card>
  );
};

export default CLAGrid;