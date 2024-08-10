import Image from "next/image";
import Coat from '@/public/trsl logo.jpg'
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