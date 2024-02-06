import React, { useState } from "react";
interface ModalProps{
    isOpen: boolean;
    onClose: () => void;
}
const OneGovID: React.FC = () => (
    <div className="py-4">
        <div>
            <label htmlFor="govid" className="block mb-2 text-sm font-medium text-gray-900">1Gov ID</label>
            <input type="number" id="govid" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required/>
        </div>
        <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="•••••••••" required/>
        </div> 
        <div className="flex space-x-2">
            <h3 className="text-gray-900">Forgot your password?</h3>
            <h4 className="text-sky-400 text-sm">Recover account</h4>
        </div>
    </div>
  );
  
  const Phone: React.FC = () => (
    <div className="py-4">
        <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 ">Enter Your Primary Phone Number</label>
            <input type="tel" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="123-45-678" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" required/>
        </div>
        <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="•••••••••" required/>
        </div> 
        <div className="flex space-x-2">
            <h3 className="text-gray-900">Forgot your password?</h3>
            <h4 className="text-sky-400 text-sm">Recover account</h4>
        </div>
    </div>
  );
  
  const Email: React.FC = () => (
    <div className="py-4">
        <div className="">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email address</label>
            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="john.doe@company.com" required/>
        </div> 
        <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="•••••••••" required/>
        </div> 
        <div className="flex space-x-2">
            <h3 className="text-gray-900">Forgot your password?</h3>
            <h4 className="text-sky-400 text-sm">Recover account</h4>
        </div>
    </div>
  );
  export const Login: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const modalClass = isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none';
    const [activeTab, setActiveTab] = useState(1);
  
    const handleTabClick = (tabNumber: number) => {
      setActiveTab(tabNumber);
    };
  
    return (
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="true"
        className={`fixed inset-0 overflow-y-auto overflow-x-hidden z-50 flex items-center justify-center ${modalClass} transition-opacity duration-300 ease-in-out`}
      >
        <div className="relative shadow-lg shadow-black w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900">Login</h3>
                <div className="bg-sky-300 rounded-sm h-1 w-20"></div>
                <h4 className="text-sm font-light text-gray-800">
                  Complete the form below to access your account
                </h4>
              </div>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                data-modal-toggle="crud-modal"
                onClick={onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="px-4 py-1">
              <h3 className="text-gray-900">Choose Login Option</h3>
              <ul className="text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex">
                <li
                  className={`w-full transition ${
                    activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  <button
                    onClick={() => handleTabClick(1)}
                    className="inline-block w-full p-4 border-r border-gray-200 focus:ring-1 focus:ring-blue-300 focus:outline-none transition"
                  >
                    1Gov ID
                  </button>
                </li>
                <li
                  className={`w-full transition ${
                    activeTab === 2 ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  <button
                    onClick={() => handleTabClick(2)}
                    className="inline-block w-full p-4 border-r border-gray-200 focus:ring-1 focus:ring-blue-300 focus:outline-none transition"
                  >
                    Phone
                  </button>
                </li>
                <li
                  className={`w-full transition ${
                    activeTab === 3 ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  <button
                    onClick={() => handleTabClick(3)}
                    className="inline-block w-full p-4 border-r border-gray-200 focus:ring-1 focus:ring-blue-300 focus:outline-none transition"
                  >
                    Email
                  </button>
                </li>
              </ul>
            </div>
            <div className="px-4">
              {activeTab === 1 && <OneGovID />}
              {activeTab === 2 && <Phone />}
              {activeTab === 3 && <Email />}
            </div>
          </div>
        </div>
      </div>
    );
  };