"use client"
import React, { useState } from "react";
import { CaseDetails } from "./CaseDetails";
import { RegistrationForm } from "./RegistrationForm";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const ApplicationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
        className={`shadow-lg fixed inset-0 z-50 flex items-center justify-center ${modalClass} transition-opacity duration-300 ease-in-out`}
        >

          <div className="relative h-full w-full">
            <div className="relative bg-slate-200 shadow-2xl w-[calc(100%-1rem)] mx-auto rounded-lg flex">
                <CaseDetails/>
                <div className="rounded-lg py-2 px-5 my-2 mr-2 shadow-lg w-full bg-white">
                  <div className="mx-0">
                    <div className="flex">
                      <div className="flex justify-center mb-2">
                          <span className="font-bold text-3xl text-gray-700">Teacher Registration</span>
                      </div>
                      <button 
                        type="button" 
                        className="text-red-700 bg-transparent hover:bg-red-300 hover:text-white rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center " 
                        data-modal-toggle="crypto-modal"
                        onClick={onClose}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                      </div>
                      <div className="bg-sky-300 w-full h-1 px-20 rounded-lg mb-2"></div>
                    </div>
                    <div className="w-full">
                      <RegistrationForm onClose={onClose}/>
                    </div>
                </div>
            </div>
          </div>
        </div>
  );
};

export default ApplicationModal;
