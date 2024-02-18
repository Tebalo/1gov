import React from "react";

interface Props{
    errors: any,
    register: any,
    name: string,
    schema_name: string,
}

export const DynamicTextInputField: React.FC<Props> = ({
    errors,
    register,
    name,
    schema_name
})=>{
    return(
        <div>
            <label 
            htmlFor={schema_name} 
            className="block text-sm font-medium text-gray-900"
            >{name}</label>
            <input 
            type="text" 
            id={schema_name} 
            {...register(schema_name)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" 
            placeholder="" 
            required/>
            {errors[schema_name] && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors[schema_name].message}
                </p>
            )}
        </div>
    );
}

export const DynamicTextInputArea: React.FC<Props> = ({
    errors,
    register,
    name,
    schema_name
})=>{
    return(
        <div>
            <label 
            htmlFor={schema_name} 
            className="block text-sm font-medium text-gray-900"
            >{name}</label>
            <input 
            type="text" 
            id={schema_name} 
            {...register(schema_name)}
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500" 
            placeholder="" 
            required/>
            {errors[schema_name] && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors[schema_name].message}
                </p>
            )}
        </div>
    );
}