
type ProfileItemsProps = {
    Label: string;
    Value: string;
}

export const ProfileItems: React.FC<ProfileItemsProps>=({Label, Value}) =>{
    return(
    <div className="flex m-1">
        <div className="bg-gray-700 rounded-l-lg px-1"><span className="text-white text-xs">{Label}</span></div>
        <div className="bg-white rounded-r-lg px-1 border border-gray-400 shadow-md"><span className="text-black text-xs">{Value}</span></div>
    </div>
    );
}