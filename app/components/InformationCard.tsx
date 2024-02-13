import {FaLightbulb  } from 'react-icons/fa';

type InformationCardProps = {
    Information: string;
}

export const InformationCard: React.FC<InformationCardProps>=({Information}) =>{
    return(
        
            <div className="border flex items-center border-green-500 rounded-lg p-2 bg-green-300 space-x-2">
                <FaLightbulb style={{ fontSize: '2rem', color: '#66CCFF' }} />
                <span className="text-gray-900 text-xs text-wrap">{Information}</span>
            </div>
        
    );
}