import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Pagination from '../Pagination/InMemory/index.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import data from '../../seeds/bad_data.json'; // initial data, need something better
import './index.scss';


const CLAGrid = () => {
  const [items, setItems] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [collapse, setCollapse] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = items.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const filteredItems = currentItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sumValues = (obj) => {
    return obj.reduce((acc, curr) => acc + curr, 0);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  const handleSortToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    const sortedItems = [...data].sort((a, b) => {
      if (newOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setItems(sortedItems);
  };

  return (
    <Card className="viewContainer">
      <div className="gridHeader">
      </div>

      <div className="teamMembers">
        <div>Team Members <span className="teamMembersTotal">{data.length} Total</span></div>
        <div className="teamMembers">
          <div style={{ marginRight: '15px' }}>
            <input
              type="text"
              placeholder="Search by worker"
              value={searchTerm}
              onChange={handleSearchChange}
              className="searchField"
            />
          </div>
          <div className="sortToggle" onClick={handleSortToggle}>
            {sortOrder === 'asc' ? 'Sort Z - A' : 'Sort A - Z'}
          </div>
          <div className="collapseToggle" onClick={handleCollapse}>{collapse ? 'Expand Section' : 'Collapse Section'}</div>
        </div>
      </div>
      {!collapse && (
        <Container className="teamContainer">
          {filteredItems.map((item, id) => (
            <Row key={`row_${id}`} className="row">
              <Col style={{ minWidth: '400px' }}>{item.name}</Col>
              <Col xs={6} className="colHours">
                <div style={{ marginRight: '30px', paddingBottom: '15px' }}>{sumValues(item.val)} Hours</div>
                <div>
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </div>
              </Col>
              {item.val.map((val, id) => (<Col className="colDecoration" key={`col_${id}`}>{val}</Col>))}
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
}

export default CLAGrid;
