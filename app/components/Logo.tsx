import Image from "next/image";

interface LogoProps{
    width:number,
    height:number
}

export const Logo: React.FC<LogoProps>=({width,height})=>{
    return (
            <Image
                src="/Code-of-Arms-colour.png"
                width={width}
                height={height}
                alt="Picture of the coat of arms"
            />
    )
}