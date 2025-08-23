export default function Welcome(){
    return(
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-500 to-sky-700 text-white">
            <div className="container mx-auto text-center p-6">
                <h1 className="text-4xl font-bold mb-4">Welcome to Botepco e-Services Portal</h1>
                <p className="text-lg mb-8">Teacher registration and licensing system for Botepco</p>
                <div className="flex justify-center space-x-4">
                    <a href="/customer/signin" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                        Customer Portal
                    </a>
                    <a href="/staff/login" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                        Staff Portal
                    </a>
                    <a href="/admin/login" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                        Admin Portal
                    </a>
                </div>

            </div>
        </div>
    )
}