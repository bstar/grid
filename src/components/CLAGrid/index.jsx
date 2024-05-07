import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Pagination from './Pagination/InMemory/index.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faSearch } from '@fortawesome/free-solid-svg-icons';
import data from '../../seeds/bad_data.json';
import './index.scss';

const CLAGrid = () => {
  const [items, setItems] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [collapse, setCollapse] = useState(false);
  const [columnSums, setColumnSums] = useState([]);
  const [totalSum, setTotalSum] = useState('');
  const [filteredData, setFilteredData] = useState(items);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const weeks = [
    { heading: 'Week 1', range: '5/1-5/7' },
    { heading: 'Week 2', range: '5/8-5/14' },
    { heading: 'Week 3', range: '5/15-5/21' },
    { heading: 'Week 4', range: '5/22-5/28' },
    { heading: 'Week 5', range: '5/29-6/4' },
    { heading: 'Week 6', range: '6/5-6/11' },
    { heading: 'Week 7', range: '6/12-6/18' },
    { heading: 'Week 8', range: '6/19-6/25' },
    { heading: 'Week 9', range: '6/26-7/2' },
  ];

  const sumColumns = (data) => (
    data.reduce((acc, item) => {
      item.val.forEach((num, index) => {
        if (acc[index] === undefined) {
          acc[index] = 0;
        }
        acc[index] += num;
      });
      return acc;
    }, [])
  );

  const isOdd = (num) => num % 2;

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

  // TODO update this to stack filters
  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    const columnSum = sumColumns(filtered);
    setColumnSums(columnSum);
    setTotalSum(columnSum.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
  }, [searchTerm]);

  return (
    <Card className="viewContainer">
      <Container className="teamContainer">
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
          <>
            <Row className="gridHeaderRow">
              <Col style={{ minWidth: '300px' }}></Col>
              <Col xs={6} className="colHours"></Col>
              {weeks.map((week, index) => (
                <Col key={`header_${index}`} className="weekItem">
                  <div><strong>{week.heading}</strong></div>
                  <div style={{ fontSize: '12px' }}>{week.range}</div>
                </Col>
              ))}
            </Row>
            { currentItems.length > 0 &&
              <Row className="gridRow">
                <Col  className="colHours" style={{ minWidth: '300px' }}>Total Hours</Col>
                <Col xs={6} className="colHours">
                  <div style={{ marginRight: '30px', paddingBottom: '15px' }}>{totalSum} Hours</div>
                </Col>
                {columnSums.map((hour, idx) => (
                  <Col className="colHeadDecoration" key={`col_${idx}`}>
                    <div className="colBorder">{hour}</div>
                  </Col>
                ))}
              </Row>
            }
            {currentItems.length === 0 &&
              <div className="noItems">No items to display</div>
            }
            {currentItems.map((item, index) => (
              <Row key={`row_${index}`} className="gridRow">
                <Col style={{ minWidth: '300px' }}>{item.name}</Col>
                <Col xs={6} className="colHours">
                  <div style={{ marginRight: '30px', paddingBottom: '15px' }}>{sumValues(item.val)} Hours</div>
                  <div>
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </div>
                </Col>
                {item.val.map((hour, idx) => (
                  <Col className="colDecoration" key={`col_${idx}`} style={!isOdd(index) ? { backgroundColor: 'rgba(226, 228, 238, 0.30)' } : {} }>
                    <div className="colBorder">{hour}</div>
                  </Col>
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
          </>
        )}
      </Container>
    </Card>
  );
};

export default CLAGrid;