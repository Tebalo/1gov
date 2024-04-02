"use client"
import React, { useState, useEffect } from 'react';

// Define the interface for your item
interface ProductItem {
    id: number;
    name: string;
    applicationID: string;
    priority: string;
    status: string;
  }

// Define your constant array with data
const productData: ProductItem[] = [
    {
      id: 1,
      name: 'Student-Teacher Application',
      applicationID: '67bf7nfe74unf843m',
      priority: '50',
      status: 'Pending-Approval',
    },
    {
        id: 1,
        name: 'Teacher Application',
        applicationID: '67bf7nfe74unf843m',
        priority: '35',
        status: 'Pending-Approval',
    },
    {
        id: 1,
        name: 'Teacher Application',
        applicationID: '67bf7nfe74unf843m',
        priority: '15',
        status: 'Pending-Approval',
    },
    {
        id: 1,
        name: 'Student-Teacher Application',
        applicationID: '67bf7nfe74unf843m',
        priority: '10',
        status: 'Pending-Approval',
    },
    {
        id: 1,
        name: 'Student-Teacher Application',
        applicationID: '67bf7nfe74unf843m',
        priority: '10',
        status: 'Pending-Approval',
    },
    {
        id: 1,
        name: 'Student-Teacher Application',
        applicationID: '67bf7nfe74unf843m',
        priority: '10',
        status: 'Pending-Approval',
    },
  ];
  

const TableFilter: React.FC = () => {
  const [data, setData] = useState<ProductItem[]>([]);
  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 'auto auto 0px 0px',
    margin: '0px',
    transform: 'translate3d(522.5px, 3847.5px, 0px)',
    zIndex: 10,
    width: '48px', // Adjust the width as needed
    background: 'white', // Adjust the background color as needed
    border: '1px solid #d2d6dc', // Adjust the border color as needed
    borderRadius: '0.375rem', // Adjust the border radius as needed
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', // Adjust the box shadow as needed
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Student-Teacher Application');
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleRadioChange = (value: string) => {
    setSelectedFilter(value);

    // Update data based on the selected filter
    switch (value) {
      case 'Student-Teacher Application':
        setData(productData.filter(item => item.name.includes("Student-Teacher Application")));
        break;
      case 'Teacher Application':
        setData(productData.filter(item => item.name.includes("Teacher Application")));
        break;
      default:
        break;
    }

    setIsDropdownOpen(false);
  };
  return (
    <div className="w-full p-4 overflow-x-auto shadow-md sm:rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            My Work
        </h2>
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
            <div className='space-x-2'>
                <button 
                id="dropdownRadioButton" 
                data-dropdown-toggle="dropdownRadio" 
                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5" 
                onClick={toggleDropdown}
                type="button">
                    <svg className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"/>
                        </svg>
                    All
                    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap-="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>
                <button 
                type="button" 
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-0 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Get Next Work</button>
            </div>
            <div
                id="dropdownRadio"
                className={`z-10 ${isDropdownOpen ? 'block' : 'hidden'} w-48 bg-white divide-y divide-gray-100 rounded-lg shadow`}
                data-popper-reference-hidden=""
                data-popper-escaped=""
                data-popper-placement="top"
                style={dropdownStyle}
                >
                <ul className="p-3 space-y-1 text-sm text-gray-700" aria-labelledby="dropdownRadioButton">
                    <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100">
                            <input id="filter-radio-example-1" type="radio" value="" name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="filter-radio-example-1" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">All</label>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 ">
                            <input checked id="filter-radio-example-2" type="radio" value="Student-Teacher Application" name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="filter-radio-example-2" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Student-Teacher Application</label>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                            <input id="filter-radio-example-3" type="radio" value="Teacher Application" name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="filter-radio-example-3" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Teacher Application</label>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <label htmlFor="table-search" className="sr-only">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            </div>
            <input type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for items"/>
        </div>
    </div>
      <table className="w-full min-w-max text-sm text-left rtl:text-right text-gray-500 ">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-2 py-3">
                    Submission Id
                </th>
                <th scope="col" className="px-2 py-3">
                    Title
                </th>
                <th scope="col" className="px-2 py-3">
                    Priority
                </th>
                <th scope="col" className="px-2 py-3">
                    Status
                </th>
                <th scope="col" className="px-2 py-3">
                    Actions
                </th>
            </tr>
        </thead>
      <tbody>
        {productData.map((item) => (
          <tr
            key={item.id}
            className="bg-white border-b hover:bg-gray-50"
          >
            <td className="px-2 py-2">{item.applicationID}</td>
            <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap">
              {item.name}
            </td>
            <td className="px-2 py-2">{item.priority}</td>
            <td className="px-2 py-2 m-10 text-gray-100">
                <div className="bg-sky-300 rounded-lg px-2 py-0 flex items-center justify-center">
                  {item.status}
                </div>
              </td>
            <td className="px-2 py-2">
              <button
                className="text-white bg-green-400 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-0.5 text-center me-2 mb-0"
                >
                Go
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
        <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 px-2 pb-1" aria-label="Table navigation">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900">1-10</span> of <span className="font-semibold text-gray-900 dark:text-white">1000</span></span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                  <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">Previous</a>
              </li>
              <li>
                  <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700s">1</a>
              </li>
              <li>
                  <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</a>
              </li>
              <li>
                  <a href="#" aria-current="page" className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">3</a>
              </li>
              <li>
                  <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">4</a>
              </li>
              <li>
                  <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">5</a>
              </li>
              <li>
                  <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">Next</a>
              </li>
          </ul>
      </nav>
    </div>
  );
};

export default TableFilter;