"use client"
import React, {useState} from 'react';

const Stepper = () => {
    return (
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
          <li className="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              Preliminary<span className="hidden sm:inline-flex sm:ms-2">Info</span>
            </span>
          </li>
          <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              <span className="me-2">2</span>
              Employment<span className="hidden sm:inline-flex sm:ms-2">Details</span>
            </span>
          </li>
          <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              <span className="me-2">2</span>
              Education<span className="hidden sm:inline-flex sm:ms-2">Details</span>
            </span>
          </li>
          <li className="flex items-center">
            <span className="me-2">3</span>
            Confirmation
          </li>
        </ol>
      );   
}

const WorkArea: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState('Newly Qualified');
    const handleRadioChange = (value:string) => {
        setSelectedOption(value);
        // Add any logic you want to perform when the radio button changes
      };
    return (                    
    <div className="flex-row w-full font-sans items-start h-auto rounded bg-gray-50 dark:bg-gray-800">
        <div className='flex items-center justify-around space-x-0 mx-10 mt-5'>
            <div className='flex relative shadow-lg border border-gray-200 dark:border-gray-800 items-center justify-center rounded-l-lg w-full py-1.5'>
                <h1>Create</h1>
            </div>
            <div className='flex relative items-center justify-center w-full py-1.5'>
                <h1>Review</h1>
            </div>
            <div className='flex relative items-center justify-center  w-full py-1.5'>
                <h1>Payment</h1>
            </div>
            <div className='flex items-center justify-center rounded-r-lg w-full py-1.5'>
                <h1>Approval</h1>
            </div>
            <div className='flex items-center justify-center rounded-r-lg w-full py-1.5'>
                <h1>Issue License</h1>
            </div>
        </div>
        <div className='mx-10'>
            <Stepper/>
        </div>
        <div className='rounded-lg p-1 mx-10 mt-5'>
            <h2 className=''>Preliminary Information</h2>      
            <form>
                <div className="grid gap-6 mb-6 md:grid-cols-2 sm:grid-cols-1">
                <div className=''>
                    <label htmlFor="citizenry" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Citizenry</label>
                    <div className='flex-row space-y-2'>                  
                        <div className="flex items-center">
                            <input id="citizen" type="radio" value="citizen" name="citizenry" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="citizen" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Citizen</label>
                        </div>
                        <div className="flex items-center">
                            <input id="non-citizen" type="radio" value="non-citizen" name="citizenry" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            <label htmlFor="non-citizen" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Non-Citizen</label>
                        </div>
                    </div>    
                </div>
                    <div className=''>
                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                        <div className='flex-row space-y-2'>
                            <div className="flex items-center">
                                <input
                                    id="newly-qualified"
                                    type="radio"
                                    value="Newly Qualified"
                                    name="default-radio"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    checked={selectedOption === 'Newly Qualified'}
                                    onChange={() => handleRadioChange('Newly Qualified')}
                                />
                                <label htmlFor="newly-qualified" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Newly Qualified</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="serving"
                                    type="radio"
                                    value="Serving"
                                    name="default-radio"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    checked={selectedOption === 'Serving'}
                                    onChange={() => handleRadioChange('Serving')}
                                />
                                <label htmlFor="serving" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Serving</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="retired"
                                    type="radio"
                                    value="Retired"
                                    name="default-radio"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    checked={selectedOption === 'Retired'}
                                    onChange={() => handleRadioChange('Retired')}
                                />
                                <label htmlFor="retired" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Retired</label>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <label htmlFor="practice" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Area of Practice</label>
                        <select
                            id="default"
                            className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option selected>Choose practice</option>
                            <option value="US">Pre-Primary</option>
                            <option value="CA">Primary</option>
                            <option value="FR">Junior Secondary</option>
                            <option value="DE">Secondary</option>
                        </select>
                    </div>  
                    <div className=''>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Registration Category</label>
                        <select
                            id="default"
                            className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option selected>Choose category</option>
                            <option value="US">Teacher Aide</option>
                            <option value="CA">Early Childhood Teacher</option>
                            <option value="DE">Primary School Teacher</option>
                            <option value="US">Junior Secondary Teacher</option>
                            <option value="CA">Senior Secondary Teacher</option>
                            <option value="DE">Special Education/Guidance and Counselling Teacher</option>
                            <option value="CA">Education Administrator</option>
                        </select>
                    </div>
                </div>
                <div className='flex float-end space-x-2'>
                    <button type="button" className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Save</button>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Next</button>
                </div>
            </form>
        </div>
    </div>
    );
}
export default WorkArea;