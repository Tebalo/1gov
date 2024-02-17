import React, {useState} from 'react';

interface Option{
    value: string;
    label: string;
}

interface DynamicRadioButtonsProps {
    options: Option[];
    name: string;
    schema_name: string;
    register: any;
    errors: any;
    onSelect: (value: string) => void;
}

export const DynamicRadioButtons: React.FC<DynamicRadioButtonsProps> = ({options, onSelect, name, register, errors, schema_name}) => {
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
                        id={schema_name}
                        name={schema_name}
                        value={option.value}
                        {...register(schema_name)}
                        checked={selectedOption === option.value}
                        onChange={handleOptionChange}
                    />

                    <label htmlFor={option.value} className='text-gray-900 mx-2 text-sm '>{option.label}</label>
                </div>
            ))}
            {errors && errors[schema_name] && (
                <p className='text-sm text-red-600'>
                    {errors[schema_name].message}
                </p>
            )}
        </div>
    );
}