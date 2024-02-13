import {FaChalkboardTeacher, FaPhone, FaEnvelope, FaMapMarkedAlt, FaMailBulk, FaLightbulb  } from 'react-icons/fa';

export const DepartmentInfoCard = () => {
    return(
        <div className="space-y-2">
            <div className="bg-white shadow-lg p-2 rounded-lg">
                <div className="space-y-2 mb-5">
                    <div className="flex justify-center">
                        <FaChalkboardTeacher style={{ fontSize: '5rem', color: '#66CCFF' }} />
                    </div>
                    <div className="flex justify-center">
                        <span className="text-gray-900 font-semibold">Headquarters (BOTEPCO)</span>
                    </div>
                    <div className="flex justify-center text-sm">
                        <span className="text-gray-900">Teacher Registration</span>
                    </div>
                </div>
                <div className="space-y-2 m-2 text-sm">
                    <div className="flex space-x-10">
                        <FaPhone style={{ fontSize: '1.5rem', color: '#66CCFF' }}/>
                        <span className="text-gray-900">(+267) 3688200/8300</span>
                    </div>
                    <div className="flex space-x-10">
                        <FaMailBulk style={{ fontSize: '1.5rem', color: '#66CCFF' }}/>
                        <span className="text-gray-900">botepco@gov.bw</span>
                    </div>
                    <div className="flex space-x-10">
                        <FaMapMarkedAlt style={{ fontSize: '1.5rem', color: '#66CCFF' }}/>
                        <span className="text-gray-900">Plot Number 64535, CBD</span>
                    </div>
                    <div className="flex space-x-10">
                        <FaEnvelope style={{ fontSize: '1.5rem', color: '#66CCFF' }}/>
                        <span className="text-gray-900">Private Bag 04848 Gaborone Botswana</span>
                    </div>
                </div>
            </div>
            <div className="border rounded-lg">
            </div>
        </div>
    );
}