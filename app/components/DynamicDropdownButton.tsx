interface Option {
    value: string;
    label: string;
}

interface SelectedProps {
    options: Option[];
    defaultPractice?:string;
    name:string;
    register: any;
    schema_name: string;
    errors: any;
    onChange: (value: string) => void;
}

export const DynamicDropdownButtons: React.FC<SelectedProps> = ({
    options, 
    defaultPractice, 
    onChange,
    register, 
    errors, 
    name, 
    schema_name}) => {
    return (
        <div>
            <label htmlFor={schema_name} className="block text-sm font-medium text-gray-900">{name}</label>
        <select
            id={schema_name}
            {...register(schema_name)}
            autoComplete={schema_name}
            defaultValue={defaultPractice}
            className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
        >
            {options.map((option)=>(
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {/* Access errors dynamically*/}
        {errors && errors[schema_name] && (
            <p className='text-sm text-red-600'>
                {errors[schema_name].message}
            </p>
        )}
      </div>
    );
}