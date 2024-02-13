"use client"
import { useState } from "react";

interface Steps{
    id:string;
    name: string;
}

interface StepperProps{
    currentStep: number;
    steps: Steps[];
}

export const Stepper: React.FC<StepperProps> = ({currentStep, steps}) => {

    return (
            <ol className="relative text-gray-500 overscroll-contain text-wrap text-xs">
                {steps.map((step,index)=>(
                    <li key={step.name} className="mb-2 ms-6">
                        {currentStep > index ?(
                            <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white">
                                <svg className="w-3.5 h-3.5 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                </svg>
                            </span>
                        ): currentStep === index?(
                            <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -start-4 ring-4 ring-white">
                                <svg className="w-3.5 h-3.5 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                </svg>
                            </span>
                        ):(
                            <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -start-4 ring-4 ring-white">
                                <svg className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z"/>
                                </svg>
                            </span>
                        )}
                        <h3 className="font-medium leading-tight">{step.name}</h3>
                        <p className="text-xs">Step details here</p>
                    </li>
                ))}                 
            </ol>
      );   
}
