import React, {useState} from 'react';

interface Option{
    value: string;
    label: string;
}

interface DynamicRadioButtonsProps {
    options: Option[];
    name: string;
    register: any;
    errors: any;
    onSelect: (value: string) => void;
}

export const DynamicRadioButtons: React.FC<DynamicRadioButtonsProps> = ({options, onSelect, name, register, errors}) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedOption(value);
        onSelect(value);
    }
    return (
        <div>
            <h3 className='block mb-2 text-sm font-medium text-gray-900'>{name}</h3>
            {options.map((option) =>(
                <div key={option.value}>
                    <input
                        type="radio"
                        id={option.value}
                        name={name}
                        value={option.value}
                        {...register(option.value)}
                        checked={selectedOption === option.value}
                        onChange={handleOptionChange}
                    />
                    {errors.firstName?.message && (
                        <p className='text-sm text-red-600'>
                            {errors.option.value.message}
                        </p>
                    )}
                    <label htmlFor={option.value} className='text-gray-900 mx-2 text-sm '>{option.label}</label>
                </div>
            ))}
        </div>
    );
}