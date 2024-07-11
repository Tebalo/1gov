import Link from 'next/link';
import '../styles/animations.css';
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-400 to-sky-600">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-8 animate-fade-in-down">
          Welcome to Teacher Registrations and Licensing Application
        </h1>
        <p className="text-xl text-white mb-12 animate-fade-in-up">
          Discover a world of possibilities with our innovative platform.
        </p>
        <Link href="/welcome" 
              className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full 
                         transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg
                         animate-bounce">
          Get Started
        </Link>
      </div>
    </div>
  );
}