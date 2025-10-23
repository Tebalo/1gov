import Link from "next/link";

export default function Welcome(){
    return(
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-500 to-sky-700 text-white">
            <div className="container mx-auto text-center p-4 sm:p-6 lg:p-8 max-w-4xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
                    Welcome to BOTEPCO e-Services Portal
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 px-2 sm:px-4 max-w-2xl mx-auto">
                    Teacher registration and licensing system for BOTEPCO
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
                    <Link
                        href="/customer/signin" 
                        className="w-full sm:w-auto inline-block bg-white text-blue-600 font-bold py-3 px-6 sm:px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    >
                        Customer Portal
                    </Link>
                    <Link
                        href="/staff/login" 
                        className="w-full sm:w-auto inline-block bg-white text-blue-600 font-bold py-3 px-6 sm:px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    >
                        Staff Portal
                    </Link>
                    <Link
                        href="/admin/login" 
                        className="w-full sm:w-auto inline-block bg-white text-blue-600 font-bold py-3 px-6 sm:px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    >
                        Admin Portal
                    </Link>
                </div>
            </div>
        </div>
    )
}