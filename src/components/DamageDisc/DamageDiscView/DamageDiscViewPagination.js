// coded by atharva on 21.02.2024//

import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from '../../../components/ViewOrder/usePagination';

import { useDispatch } from 'react-redux';

import { selectedDamageDiscPagesNumber} from "../../../redux/actions/damageDiscAction";


const ITEMS_PER_PAGE = 10;

const DamageDiscViewPagination = (props) => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        className,
    } = props;

    const dispatch = useDispatch();
    console.log("hi there");
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE); //Calculate total pages

    const paginationRange = usePagination({
        currentPage,
        totalCount: totalPages,
        siblingCount,
    });

    // if (totalPages === 1) {
    //     return null; // if there's only one page , this function lets hide pagination
    // }

    const onNext = () => {
        onPageChange(currentPage + 1);
        console.log("onNext click ",currentPage)
        dispatch(selectedDamageDiscPagesNumber(currentPage));
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
        console.log("prev click ",currentPage -2)

        dispatch(selectedDamageDiscPagesNumber(currentPage - 2));
    };

    return (
        <ul className={classnames('pagination-container', { [className]: className })}>
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
                  dispatch(selectedDamageDiscPagesNumber(pageNumber - 1));
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

export default DamageDiscViewPagination;