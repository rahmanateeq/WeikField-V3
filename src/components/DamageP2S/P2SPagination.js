
import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from '../ViewOrder/usePagination';

import { useDispatch } from 'react-redux';
import { selectedP2SPagesNumber } from '../../redux/actions/p2sAction';

 const ITEMS_PER_PAGE = 10; // Set the number of items to display per page

const P2SPagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    className,
  } = props;

  const dispatch = useDispatch();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE); // Calculate total pages

  const paginationRange = usePagination({
    currentPage,
    totalCount: totalPages,
    siblingCount,
  });

  if (totalPages === 1) {
    return null; // Hide pagination if there's only one page
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
    console.log("onNext click ",currentPage)
    dispatch(selectedP2SPagesNumber(currentPage));
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
    console.log("prev click ",currentPage - 2)

    dispatch(selectedP2SPagesNumber(currentPage - 2));
  };

  return (
    <ul className={classnames('pagination-container', { [className] : className })}>
      <li
        title="Previous"
        className={classnames('pagination-item fas fa-arrow-left', {
          disabled: currentPage === 1,
        })}
        onClick={onPrevious}
      ></li>
      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return <li key={pageNumber} className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li
            key={pageNumber}
            className={classnames('pagination-item', {
              selected: pageNumber === currentPage,
            })}
            onClick={() => {
              onPageChange(pageNumber);
             console.log('present click',pageNumber)
              dispatch(selectedP2SPagesNumber(pageNumber - 1));
            }}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        title="Next"
        className={classnames('pagination-item fas fa-arrow-right', {
          disabled: currentPage === totalPages,
        })}
        onClick={onNext}
      ></li>
    </ul>
  );
};

export default P2SPagination;



