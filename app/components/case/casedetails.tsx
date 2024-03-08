"use client"
import React,{useState} from 'react';
const CaseDetails: React.FC = () => {
    const [isCaseDetailsVisible, setCaseDetailsVisibility] = useState(true);

    const toggleCaseDetailsVisibility = () => {
        setCaseDetailsVisibility(!isCaseDetailsVisible);
    }
  return (       
    <>  
        <button
            className='fixed top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-md'
            onClick={toggleCaseDetailsVisibility}
        >
            {isCaseDetailsVisible ? 'Hide' : 'Unhide'}
        </button>
        {isCaseDetailsVisible &&(          
        <div className="w-2/5 items-start bg-gray-50 justify-start h-auto dark:bg-gray-800">
            <div className="max-w-sm p-2 w-full bg-blue-600 border border-gray-200 shadow dark:bg-blue-600 dark:border-gray-700">
                <div className='flex gap-2 items-center'>
                    <div className='rounded-lg bg-blue-900 m-2 p-2'>
                        <svg className="w-7 h-7 text-white dark:text-gray-400 mb-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058 5H5.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM11 13H9v7h2v-7Zm-4 0H2v5a2 2 0 0 0 2 2h3v-7Zm6 0v7h3a2 2 0 0 0 2-2v-5h-5Z"/>
                        </svg>
                    </div>
                    <div className='font-sans text-white dark:text-white'>
                        <a href="#">
                            <p>R-00001</p>
                            <h5 className="mb-2 text-xl tracking-tight">Teacher Registration</h5>
                        </a>
                    </div>
                </div>
            </div>
            <div className='flex border-b-2 border-dashed border-gray-500 dark:border-gray-200 m-2 justify-start md:justify-between'>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-4 py-1.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Edit</button>
            </div>
            <div className='m-5 space-y-3'>
                <div>
                    <h1 className='text-sm text-gray-500'>Priority</h1>
                    <h5 className='text-3xl font-semibold tracking-tight'>10</h5>
                </div>
                <div className='flex space-x-11'>
                    <h1 className='text-sm text-gray-500'>Status</h1>
                    <div className='px-1 py-0 bg-blue-300 rounded-lg'>
                        <h1 className='text-blue text-sm text-indigo-900'>New</h1>
                    </div>
                </div>
                <div className='flex space-x-9'>
                    <h1 className='text-sm text-gray-500'>Created</h1>
                    <div className=''>
                        <h1 className='text-sm text-sky-600'>Bopaki Tebalo</h1>
                        <h1 className='text-sm font-thin'>less than a minute ago</h1>
                    </div>
                </div>
                <div className='flex space-x-9'>
                    <h1 className='text-sm text-gray-500'>Updated</h1>
                    <div className=''>
                        <h1 className='text-sm text-sky-600'>Bopaki Tebalo</h1>
                        <h1 className='text-sm font-thin'>less than a minute ago</h1>
                    </div>
                </div>
            </div>
            <div className='border-r-4 shadow-sm border-blue-700 h-10 items-center'>
            </div>
        </div>
        )}
    </> 
    );
}
export default CaseDetails;