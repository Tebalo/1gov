'use client'
import { teacherSteps } from "@/app/lib/store";
import Props from "./components/types";
import {motion} from 'framer-motion';
import { useState } from "react";
import { Stepper } from "../Stepper";
import { Preliminary } from "./components/preliminary";
import { Button } from "@/components/ui/button";
import { Bio } from "./components/bio";
import { Employment } from "./components/employment";
import { StudyProgramme } from "./components/study-programme";
import { Qualifications } from "./components/qualifications";
import { Disability } from "./components/disability";
import { Offence } from "./components/offence";
import { Attachments } from "./components/attachments";
import { Declaration } from "./components/declaration";


interface Work{
    data: Props,
    userRole: string
}
export const ApplicationForStudentRegistration: React.FC<Work> = (data, userRole) => {
    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const delta = currentStep - previousStep
    const next = async () => {
        const fields = teacherSteps[currentStep].fields

        if (currentStep < teacherSteps.length - 1){
            if(currentStep === teacherSteps.length - 2){

            }

            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1)
        }
    }   
    const prev = () => {
        if (currentStep > 0){
            setPreviousStep(step => step + 1)
            setCurrentStep(step => step - 1)
        }
    }
    return (
        <div className="rounded-lg py-2 px-5 my-2 mr-2 shadow-lg w-full bg-white">
            <div className="w-full">
                <div className="flex w-full">
                    <div className="flex justify-center mb-2 w-full">
                        <span className="font-bold text-3xl text-gray-700">Application For Student-Teacher Registration</span>
                    </div>
                </div>
                <div className="bg-sky-300 w-full h-1 px-20 rounded-lg mb-2"/>
                <div className="flex md:m-5 w-full space-x-1 md:h-full">
                    {/* steps */}
                    <nav aria-label="Progress" className="w-48 hidden md:block">
                        <Stepper currentStep={currentStep} steps={teacherSteps}/>
                    </nav>
                    {/* content area */}
                    <div className="w-[calc(100%)] pr-2">
                        {currentStep === 0 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-80 h-96 w-full p-3 rounded-lg mb-2 mr-1">
                                    <Preliminary {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 1 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-80 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Bio {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-80 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Employment {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-80 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Qualifications {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 4 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-80 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Disability {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 5 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-80 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Offence {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 6 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-80 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <Attachments/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 7 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-80 h-96 p-3 rounded-lg mb-2 mr-1">
                                <Declaration {...data?.data}/>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 8 && (
                            <motion.div
                                initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                <div className="border md:h-80 h-96 p-3 rounded-lg mb-2 mr-1">
                                    <span>Add comment</span>
                                </div>
                            </motion.div>
                        )}
                        {/* Navigation buttons */}
                        <div className="flex float-end space-x-2 mx-5">
                            <Button
                            variant='outline'
                            onClick={prev}
                            >
                                Prev
                            </Button>
                            <Button
                            variant='default'
                            onClick={next}
                            >
                                Next
                            </Button>
                            <Button
                            variant='outline'
                            >
                                Reject
                            </Button>
                            <Button
                            variant='default'
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}