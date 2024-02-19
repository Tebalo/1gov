"use client"
import FileUploader from "./FileUploader";
import React, {useState} from "react";
interface LevelProps{

}

export const CertificationLevel: React.FC<LevelProps> = ({}) => {
    const [numOfQualifications, setNumOfQualifications] = useState(1); // State to track the number of qualifications

    const handleAddQualification = () => {
        setNumOfQualifications(prevNum => prevNum + 1)
    }
    const handleSubtractQualification = () => {
        setNumOfQualifications(prevNum => prevNum - 1)
    }
    return(
        <div className="">
            {/*Scroll Content - Add-Remove Form Items*/}
            <div className="flex">
                <div className="">
                    <span className="text-gray-900 text-sm">How many Teaching Certifications do you have?</span>
                    <div className="flex items-center">
                        <button onClick={handleSubtractQualification} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <div>
                            <input type="number" id="first_product" value={numOfQualifications} className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 " placeholder="1" required />
                        </div>
                        <button onClick={handleAddQualification} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-auto h-48 bg-white">
                {/* Repeat the following block of JSX based on numOfQualification */}
                {[...Array(numOfQualifications)].map((_,index)=>(
                <div key={index} className="w-full grid grid-cols-3 gap-x-5 gap-y-2 border border-dashed border-gray-500 p-1 mt-1 rounded-lg">
                    <div>
                        <label className="text-gray-900 text-sm">Qualification</label>
                        <input
                            type="text"
                            id={"qualification"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Certification Name"
                            required
                            />
                    </div>
                    <div>
                        <label className="text-gray-900 text-sm">Awarding Institution</label>
                        <input
                            type="text"
                            id={"institution"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="School"
                            required
                            />
                    </div>
                    <div>
                        <div>
                            <label className="text-gray-900 text-sm">Year Of Completion</label>
                            <input
                                type="number"
                                id={"qualification_year"+index}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                                placeholder="Year..."
                                required
                                />
                        </div>
                    </div>
                    <div className="">
                        <label className="text-gray-900 text-sm">Teaching Subjects</label>
                        <input
                            type="text"
                            id={"teaching_subjects"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Subjects..."
                            required
                            />
                    </div>
                    <div className="">
                        <FileUploader
                            url=""
                            acceptedFileTypes={[
                                "image/png",
                                "image/jpeg",
                            ]}
                            maxFileSize={100}
                            label=""
                            labelAlt=""
                            />
                    </div>
                    <div className="flex justify-center my-5">
                        <button 
                        type="button" 
                        hidden
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                        >Remove</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export const DiplomaLevel: React.FC<LevelProps> = ({}) => {
    const [numOfQualifications, setNumOfQualifications] = useState(1); // State to track the number of qualifications

    const handleAddQualification = () => {
        setNumOfQualifications(prevNum => prevNum + 1)
    }
    const handleSubtractQualification = () => {
        setNumOfQualifications(prevNum => prevNum - 1)
    }
    return(
        <div className="">
            {/*Scroll Content - Add-Remove Form Items*/}
            <div className="flex">
                <div className="">
                    <span className="text-gray-900 text-sm">How many Teaching Diplomas do you have?</span>
                    <div className="flex items-center">
                        <button onClick={handleSubtractQualification} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <div>
                            <input type="number" id="first_product" value={numOfQualifications} className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 " placeholder="1" required />
                        </div>
                        <button onClick={handleAddQualification} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-auto h-48 bg-white">
                {/* Repeat the following block of JSX based on numOfQualification */}
                {[...Array(numOfQualifications)].map((_,index)=>(
                <div key={index} className="w-full grid grid-cols-3 gap-x-5 gap-y-2 border border-dashed border-gray-500 p-1 mt-1 rounded-lg">
                    <div>
                        <label className="text-gray-900 text-sm">Qualification</label>
                        <input
                            type="text"
                            id={"qualification"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Diploma Name"
                            required
                            />
                    </div>
                    <div>
                        <label className="text-gray-900 text-sm">Awarding Institution</label>
                        <input
                            type="text"
                            id={"institution"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="School..."
                            required
                            />
                    </div>
                    <div>
                        <div>
                            <label className="text-gray-900 text-sm">Year Of Completion</label>
                            <input
                                type="number"
                                id={"qualification_year"+index}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                                placeholder="Year..."
                                required
                                />
                        </div>
                    </div>
                    <div className="">
                        <label className="text-gray-900 text-sm">Teaching Subjects</label>
                        <input
                            type="text"
                            id={"teaching_subjects"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Subjects..."
                            required
                            />
                    </div>
                    <div className="">
                        <FileUploader
                            url=""
                            acceptedFileTypes={[
                                "image/png",
                                "image/jpeg",
                            ]}
                            maxFileSize={100}
                            label=""
                            labelAlt=""
                            />
                    </div>
                    <div className="flex justify-center my-5">
                        <button 
                        type="button" 
                        hidden
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                        >Remove</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export const PostGradDiplomaLevel: React.FC<LevelProps> = ({}) => {
    const [numOfQualifications, setNumOfQualifications] = useState(1); // State to track the number of qualifications

    const handleAddQualification = () => {
        setNumOfQualifications(prevNum => prevNum + 1)
    }
    const handleSubtractQualification = () => {
        setNumOfQualifications(prevNum => prevNum - 1)
    }
    return(
        <div className="">
            {/*Scroll Content - Add-Remove Form Items*/}
            <div className="flex">
                <div className="">
                    <span className="text-gray-900 text-sm">How many Teaching Post Grad Diploma do you have?</span>
                    <div className="flex items-center">
                        <button onClick={handleSubtractQualification} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <div>
                            <input type="number" id="first_product" value={numOfQualifications} className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 " placeholder="1" required />
                        </div>
                        <button onClick={handleAddQualification} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-auto h-48 bg-white">
                {/* Repeat the following block of JSX based on numOfQualification */}
                {[...Array(numOfQualifications)].map((_,index)=>(
                <div key={index} className="w-full grid grid-cols-3 gap-x-5 gap-y-2 border border-dashed border-gray-500 p-1 mt-1 rounded-lg">
                    <div>
                        <label className="text-gray-900 text-sm">Qualification</label>
                        <input
                            type="text"
                            id={"qualification"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Post Grad Diploma Name"
                            required
                            />
                    </div>
                    <div>
                        <label className="text-gray-900 text-sm">Awarding Institution</label>
                        <input
                            type="text"
                            id={"institution"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="School..."
                            required
                            />
                    </div>
                    <div>
                        <div>
                            <label className="text-gray-900 text-sm">Year Of Completion</label>
                            <input
                                type="number"
                                id={"qualification_year"+index}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                                placeholder="Year..."
                                required
                                />
                        </div>
                    </div>
                    <div className="">
                        <label className="text-gray-900 text-sm">Teaching Subjects</label>
                        <input
                            type="text"
                            id={"teaching_subjects"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Subjects..."
                            required
                            />
                    </div>
                    <div className="">
                        <FileUploader
                            url=""
                            acceptedFileTypes={[
                                "image/png",
                                "image/jpeg",
                            ]}
                            maxFileSize={100}
                            label=""
                            labelAlt=""
                            />
                    </div>
                    <div className="flex justify-center my-5">
                        <button 
                        type="button" 
                        hidden
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                        >Remove</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export const DegreeLevel: React.FC<LevelProps> = ({}) => {
    const [numOfQualifications, setNumOfQualifications] = useState(1); // State to track the number of qualifications

    const handleAddQualification = () => {
        setNumOfQualifications(prevNum => prevNum + 1)
    }
    const handleSubtractQualification = () => {
        setNumOfQualifications(prevNum => prevNum - 1)
    }
    return(
        <div className="">
            {/*Scroll Content - Add-Remove Form Items*/}
            <div className="flex">
                <div className="">
                    <span className="text-gray-900 text-sm">How many Teaching Degrees do you have?</span>
                    <div className="flex items-center">
                        <button onClick={handleSubtractQualification} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <div>
                            <input type="number" id="first_product" value={numOfQualifications} className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 " placeholder="1" required />
                        </div>
                        <button onClick={handleAddQualification} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-auto h-48 bg-white">
                {/* Repeat the following block of JSX based on numOfQualification */}
                {[...Array(numOfQualifications)].map((_,index)=>(
                <div key={index} className="w-full grid grid-cols-3 gap-x-5 gap-y-2 border border-dashed border-gray-500 p-1 mt-1 rounded-lg">
                    <div>
                        <label className="text-gray-900 text-sm">Qualification</label>
                        <input
                            type="text"
                            id={"qualification"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Degree Name"
                            required
                            />
                    </div>
                    <div>
                        <label className="text-gray-900 text-sm">Awarding Institution</label>
                        <input
                            type="text"
                            id={"institution"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="School..."
                            required
                            />
                    </div>
                    <div>
                        <div>
                            <label className="text-gray-900 text-sm">Year Of Completion</label>
                            <input
                                type="number"
                                id={"qualification_year"+index}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                                placeholder="Year..."
                                required
                                />
                        </div>
                    </div>
                    <div className="">
                        <label className="text-gray-900 text-sm">Teaching Subjects</label>
                        <input
                            type="text"
                            id={"teaching_subjects"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Subjects..."
                            required
                            />
                    </div>
                    <div className="">
                        <FileUploader
                            url=""
                            acceptedFileTypes={[
                                "image/png",
                                "image/jpeg",
                            ]}
                            maxFileSize={100}
                            label=""
                            labelAlt=""
                            />
                    </div>
                    <div className="flex justify-center my-5">
                        <button 
                        type="button" 
                        hidden
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                        >Remove</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export const PostGradCertificateLevel: React.FC<LevelProps> = ({}) => {
    const [numOfQualifications, setNumOfQualifications] = useState(1); // State to track the number of qualifications

    const handleAddQualification = () => {
        setNumOfQualifications(prevNum => prevNum + 1)
    }
    const handleSubtractQualification = () => {
        setNumOfQualifications(prevNum => prevNum - 1)
    }
    return(
        <div className="">
            {/*Scroll Content - Add-Remove Form Items*/}
            <div className="flex">
                <div className="">
                    <span className="text-gray-900 text-sm">How many Teaching Post Grad Certificate do you have?</span>
                    <div className="flex items-center">
                        <button onClick={handleSubtractQualification} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <div>
                            <input type="number" id="first_product" value={numOfQualifications} className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 " placeholder="1" required />
                        </div>
                        <button onClick={handleAddQualification} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-auto h-68 bg-white">
                {/* Repeat the following block of JSX based on numOfQualification */}
                {[...Array(numOfQualifications)].map((_,index)=>(
                <div key={index} className="w-full grid grid-cols-3 gap-x-5 gap-y-2 border border-dashed border-gray-500 p-1 mt-1 rounded-lg">
                    <div>
                        <label className="text-gray-900 text-sm">Qualification</label>
                        <input
                            type="text"
                            id={"qualification"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Post Grad Certificate Name"
                            required
                            />
                    </div>
                    <div>
                        <label className="text-gray-900 text-sm">Awarding Institution</label>
                        <input
                            type="text"
                            id={"institution"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="School..."
                            required
                            />
                    </div>
                    <div>
                        <div>
                            <label className="text-gray-900 text-sm">Year Of Completion</label>
                            <input
                                type="number"
                                id={"qualification_year"+index}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                                placeholder="Year..."
                                required
                                />
                        </div>
                    </div>
                    <div className="">
                        <label className="text-gray-900 text-sm">Teaching Subjects</label>
                        <input
                            type="text"
                            id={"teaching_subjects"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Subjects..."
                            required
                            />
                    </div>
                    <div className="">
                        <FileUploader
                            url=""
                            acceptedFileTypes={[
                                "image/png",
                                "image/jpeg",
                            ]}
                            maxFileSize={100}
                            label=""
                            labelAlt=""
                            />
                    </div>
                    <div className="flex justify-center my-5">
                        <button 
                        type="button" 
                        hidden
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                        >Remove</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export const MastersLevel: React.FC<LevelProps> = ({}) => {
    const [numOfQualifications, setNumOfQualifications] = useState(1); // State to track the number of qualifications

    const handleAddQualification = () => {
        setNumOfQualifications(prevNum => prevNum + 1)
    }
    const handleSubtractQualification = () => {
        setNumOfQualifications(prevNum => prevNum - 1)
    }
    return(
        <div className="">
            {/*Scroll Content - Add-Remove Form Items*/}
            <div className="flex">
                <div className="">
                    <span className="text-gray-900 text-sm">How many Teaching Masters do you have?</span>
                    <div className="flex items-center">
                        <button onClick={handleSubtractQualification} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <div>
                            <input type="number" id="first_product" value={numOfQualifications} className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 " placeholder="1" required />
                        </div>
                        <button onClick={handleAddQualification} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-auto h-48 bg-white">
                {/* Repeat the following block of JSX based on numOfQualification */}
                {[...Array(numOfQualifications)].map((_,index)=>(
                <div key={index} className="w-full grid grid-cols-3 gap-x-5 gap-y-2 border border-dashed border-gray-500 p-1 mt-1 rounded-lg">
                    <div>
                        <label className="text-gray-900 text-sm">Qualification</label>
                        <input
                            type="text"
                            id={"qualification"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Masters Name"
                            required
                            />
                    </div>
                    <div>
                        <label className="text-gray-900 text-sm">Awarding Institution</label>
                        <input
                            type="text"
                            id={"institution"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="School..."
                            required
                            />
                    </div>
                    <div>
                        <div>
                            <label className="text-gray-900 text-sm">Year Of Completion</label>
                            <input
                                type="number"
                                id={"qualification_year"+index}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                                placeholder="Year..."
                                required
                                />
                        </div>
                    </div>
                    <div className="">
                        <label className="text-gray-900 text-sm">Teaching Subjects</label>
                        <input
                            type="text"
                            id={"teaching_subjects"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Subjects..."
                            required
                            />
                    </div>
                    <div className="">
                        <FileUploader
                            url=""
                            acceptedFileTypes={[
                                "image/png",
                                "image/jpeg",
                            ]}
                            maxFileSize={100}
                            label=""
                            labelAlt=""
                            />
                    </div>
                    <div className="flex justify-center my-5">
                        <button 
                        type="button" 
                        hidden
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                        >Remove</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export const PhDLevel: React.FC<LevelProps> = ({}) => {
    const [numOfQualifications, setNumOfQualifications] = useState(1); // State to track the number of qualifications

    const handleAddQualification = () => {
        setNumOfQualifications(prevNum => prevNum + 1)
    }
    const handleSubtractQualification = () => {
        setNumOfQualifications(prevNum => prevNum - 1)
    }
    return(
        <div className="">
            {/*Scroll Content - Add-Remove Form Items*/}
            <div className="flex">
                <div className="">
                    <span className="text-gray-900 text-sm">How many Teaching Post Grad Certificate do you have?</span>
                    <div className="flex items-center">
                        <button onClick={handleSubtractQualification} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <div>
                            <input type="number" id="first_product" value={numOfQualifications} className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 " placeholder="1" required />
                        </div>
                        <button onClick={handleAddQualification} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                            <span className="sr-only">Quantity button</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-auto h-48 bg-white">
                {/* Repeat the following block of JSX based on numOfQualification */}
                {[...Array(numOfQualifications)].map((_,index)=>(
                <div key={index} className="w-full grid grid-cols-3 gap-x-5 gap-y-2 border border-dashed border-gray-500 p-1 mt-1 rounded-lg">
                    <div>
                        <label className="text-gray-900 text-sm">Qualification</label>
                        <input
                            type="text"
                            id={"qualification"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="PhD Name"
                            required
                            />
                    </div>
                    <div>
                        <label className="text-gray-900 text-sm">Awarding Institution</label>
                        <input
                            type="text"
                            id={"institution"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="School..."
                            required
                            />
                    </div>
                    <div>
                        <div>
                            <label className="text-gray-900 text-sm">Year Of Completion</label>
                            <input
                                type="number"
                                id={"qualification_year"+index}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                                placeholder="Year..."
                                required
                                />
                        </div>
                    </div>
                    <div className="">
                        <label className="text-gray-900 text-sm">Teaching Subjects</label>
                        <input
                            type="text"
                            id={"teaching_subjects"+index}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 block w-full p-2.5"
                            placeholder="Subjects..."
                            required
                            />
                    </div>
                    <div className="">
                        <FileUploader
                            url=""
                            acceptedFileTypes={[
                                "image/png",
                                "image/jpeg",
                            ]}
                            maxFileSize={100}
                            label=""
                            labelAlt=""
                            />
                    </div>
                    <div className="flex justify-center my-5">
                        <button 
                        type="button" 
                        hidden
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                        >Remove</button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}
