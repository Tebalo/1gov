import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectedProps {
    options: Option[];
    defaultPractice?:string;
    name:string;
    onChange: (value: string) => void;
}

export const DynamicDropdownButtons: React.FC<SelectedProps> = ({options, defaultPractice, onChange, name}) => {

    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPractice = event.target.value;
        onChange(selectedPractice);
        console.log(selectedPractice)
    }
    return (
        <div>
            <label htmlFor="practice" className="block mb-2 text-sm font-medium text-gray-900">{name}</label>
            <select
            id={name}
            className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={defaultPractice} 
            onChange={handleDropdownChange} 
        >
            <option disabled>Select...</option>
            {options.map((option)=>(
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
      </div>
    );
}