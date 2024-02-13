"use client"
import React, { useState } from "react";
import {FaChalkboardTeacher, FaPhone, FaEnvelope, FaMapMarkedAlt, FaMailBulk, FaLightbulb  } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Stepper = () => {
    return (
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 sm:text-base">
          <li className="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10">
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
              </svg>
              Preliminary<span className="hidden sm:inline-flex sm:ms-2">Info</span>
            </span>
          </li>
          <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10">
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
              <span className="me-2">2</span>
              Employment<span className="hidden sm:inline-flex sm:ms-2">Details</span>
            </span>
          </li>
          <li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10">
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
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

const CaseDetails = () => {
    return(
        <div className="p-2 w-96">
            <DepartmentInfoCard/>
            <ProfileInfo/>
        </div>
    );
}
type ProfileItemsProps = {
    Label: string;
    Value: string;
}

const ProfileItems: React.FC<ProfileItemsProps>=({Label, Value}) =>{
    return(
    <div className="flex m-1">
        <div className="bg-gray-700 rounded-l-lg px-1"><span className="text-white text-xs">{Label}</span></div>
        <div className="bg-white rounded-r-lg px-1 border border-gray-400 shadow-md"><span className="text-black text-xs">{Value}</span></div>
    </div>
    );
}
const ProfileInfo = () => {
    return(
        <div className="bg-white rounded-lg shadow-lg">
            <div className="p-2 mx-1">
                <div>
                    <span className="text-gray-900 font-semibold">Profile Information</span>
                </div>
                <div className="flex items-center mb-1">
                    <span className="text-gray-900 text-sm text-wrap">The following information will be submitted along with your application.</span>
                </div>
                <div className="border flex items-center border-green-500 rounded-lg p-2 bg-green-300 space-x-2">
                    <FaLightbulb style={{ fontSize: '2rem', color: '#66CCFF' }} />
                    <span className="text-gray-900 text-xs text-wrap">Go to your profile page and add any missing information to your profile before proceeding with this application.</span>
                </div>
            </div>
            <div className="mx-2 flex flex-wrap">    
                <ProfileItems Label="First Name" Value="Michael"/>
                <ProfileItems Label="Middle Name" Value="Doe"/>
                <ProfileItems Label="Last Name" Value="Michael"/>
                <ProfileItems Label="Primary Email Address" Value="michael@gmail.com"/>
                <ProfileItems Label="Primary Phone Number" Value="+2677000000"/>
            </div>
        </div>
    );
}

const DepartmentInfoCard = () => {
    return(
        <div className="space-y-2">
            <div className="bg-white shadow-lg p-2 rounded-lg">
                <div className="space-y-2 mb-5">
                    <div className="flex justify-center">
                        <FaChalkboardTeacher style={{ fontSize: '5rem', color: '#66CCFF' }} />
                    </div>
                    <div className="flex justify-center">
                        <span className="text-gray-900 font-semibold">Headquarters (BOTEPCO)</span>
                    </div>
                    <div className="flex justify-center text-sm">
                        <span className="text-gray-900">Teacher Registration</span>
                    </div>
                </div>
                <div className="space-y-2 m-2 text-sm">
                    <div className="flex space-x-10">
                        <FaPhone style={{ fontSize: '1.5rem', color: '#66CCFF' }}/>
                        <span className="text-gray-900">(+267) 3688200/8300</span>
                    </div>
                    <div className="flex space-x-10">
                        <FaMailBulk style={{ fontSize: '1.5rem', color: '#66CCFF' }}/>
                        <span className="text-gray-900">botepco@gov.bw</span>
                    </div>
                    <div className="flex space-x-10">
                        <FaMapMarkedAlt style={{ fontSize: '1.5rem', color: '#66CCFF' }}/>
                        <span className="text-gray-900">Plot Number 64535, CBD</span>
                    </div>
                    <div className="flex space-x-10">
                        <FaEnvelope style={{ fontSize: '1.5rem', color: '#66CCFF' }}/>
                        <span className="text-gray-900">Private Bag 04848 Gaborone Botswana</span>
                    </div>
                </div>
            </div>
            <div className="border rounded-lg">

            </div>
        </div>
    );
}
const RadioOption: React.FC<{
  id: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}> = ({ id, value, label, checked, onChange }) => (
  <div className="flex items-center">
    <input
      id={id}
      type="radio"
      value={value}
      name="default-radio"
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
      checked={checked}
      onChange={() => onChange(value)}
    />
    <label htmlFor={id} className="ms-2 text-sm font-medium text-gray-900">
      {label}
    </label>
  </div>
);

const TeacherApplicationForm: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const modalClass = isOpen ? "opacity-100" : "opacity-0 pointer-events-none";
  const [selectedOption, setSelectedOption] = useState("Newly Qualified");

  const handleRadioChange = (value: string) => {
    setSelectedOption(value);
  };

  const dropdownOptions = [
    "Pre-Primary",
    "Primary",
    "Junior Secondary",
    "Secondary",
  ];

  return ( 
        <div
        id="service-list-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`shadow-lg fixed inset-0 border overflow-y-auto overflow-x-hidden z-50 flex items-center justify-center ${modalClass} transition-opacity duration-300 ease-in-out`}
        >

        <div className="relative p-4">
            <div className="relative bg-slate-200 shadow-2xl rounded-lg h-screen md:h-full  flex">
                <CaseDetails/>
                <div className="rounded-lg py-2 px-5 m-2 shadow-lg bg-white">
                <div className="mx-0">
                    <div className="flex justify-center mb-2">
                        <span className="font-bold text-3xl text-gray-700">Teacher Registration</span>
                    </div>
                    <div className="bg-sky-300 w-full h-1 px-20 rounded-lg mb-2"></div>
                    <div className='py-2'>
                        <Stepper/>
                    </div>
                    </div>
                        <form>
                            <div className="grid gap-6 mb-6 md:grid-cols-2 sm:grid-cols-1">
                                <div className=''>
                                    <label htmlFor="citizenry" className="block mb-2 text-sm font-medium text-gray-900">Citizenry</label>
                                    <div className='flex-row space-y-2'>                  
                                        <div className="flex items-center">
                                            <input id="citizen" type="radio" value="citizen" name="citizenry" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                            <label htmlFor="citizen" className="ms-2 text-sm font-medium text-gray-900">Citizen</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input id="non-citizen" type="radio" value="non-citizen" name="citizenry" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"/>
                                            <label htmlFor="non-citizen" className="ms-2 text-sm font-medium text-gray-900">Non-Citizen</label>
                                        </div>
                                    </div>    
                                </div>
                                <div className=''>
                                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900">Status</label>
                                    <div className='flex-row space-y-2'>
                                        <div className="flex items-center">
                                            <input
                                                id="newly-qualified"
                                                type="radio"
                                                value="Newly Qualified"
                                                name="default-radio"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                checked={selectedOption === 'Newly Qualified'}
                                                onChange={() => handleRadioChange('Newly Qualified')}
                                            />
                                            <label htmlFor="newly-qualified" className="ms-2 text-sm font-medium text-gray-900">Newly Qualified</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="serving"
                                                type="radio"
                                                value="Serving"
                                                name="default-radio"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                                                checked={selectedOption === 'Serving'}
                                                onChange={() => handleRadioChange('Serving')}
                                            />
                                            <label htmlFor="serving" className="ms-2 text-sm font-medium text-gray-900">Serving</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="retired"
                                                type="radio"
                                                value="Retired"
                                                name="default-radio"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                checked={selectedOption === 'Retired'}
                                                onChange={() => handleRadioChange('Retired')}
                                            />
                                            <label htmlFor="retired" className="ms-2 text-sm font-medium text-gray-900">Retired</label>
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <label htmlFor="practice" className="block mb-2 text-sm font-medium text-gray-900">Area of Practice</label>
                                    <select
                                        id="default"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                        <option selected>Choose practice</option>
                                        <option value="Pre-Primary">Pre-Primary</option>
                                        <option value="Primary">Primary</option>
                                        <option value="Junior Secondary">Junior Secondary</option>
                                        <option value="Secondary">Secondary</option>
                                    </select>
                                </div>  
                                <div className=''>
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Registration Category</label>
                                    <select
                                        id="default"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    >
                                        <option selected>Choose category</option>
                                        <option value="Teacher Aide">Teacher Aide</option>
                                        <option value="Early Childhood Teacher">Early Childhood Teacher</option>
                                        <option value="Primary School Teacher">Primary School Teacher</option>
                                        <option value="Junior Secondary Teacher">Junior Secondary Teacher</option>
                                        <option value="Senior Secondary Teacher">Senior Secondary Teacher</option>
                                        <option value="Special Education/Guidance and Counselling Teacher">Special Education/Guidance and Counselling Teacher</option>
                                        <option value="Education Administrator">Education Administrator</option>
                                    </select>
                                </div>
                            </div>
                            <div className='flex float-end space-x-2'>
                                <button type="button" className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">Save</button>
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center">Next</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default TeacherApplicationForm;
