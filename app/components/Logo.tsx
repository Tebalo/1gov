import Image from "next/image";
import Coat from '@/public/Code-of-Arms-colour.png'
interface LogoProps{
    width:number,
    height:number
}

export const Logo: React.FC<LogoProps>=({width,height})=>{
    return (
            <Image
                src={Coat}
                width={width}
                height={height}
                alt="Picture of the coat of arms"
            />
    )
}