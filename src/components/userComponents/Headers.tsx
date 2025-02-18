import { Link } from "react-router-dom";
import person from '../../assets/person.png';
import { useSearchParams } from "react-router-dom";


export default function Header() {
  const [searchParams] = useSearchParams();
  const categories = searchParams.get('categories')?.split(',') || [];
  console.log(categories);
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="container mx-auto px-6 py-6 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="text-3xl font-extrabold text-white tracking-wide hover:text-blue-300 transition-all duration-300">
          MeetCraft
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-8">
            <li>
              <Link to="/home" className="text-white text-lg font-medium hover:text-yellow-400 transition-all duration-300">
                Events
              </Link>
            </li>
            
          
            <li>
              <Link to="/logout" className="text-white text-lg font-medium hover:text-yellow-400 transition-all duration-300">
                Logout
              </Link>
            </li>
            <li>
              {/* Profile Image */}
            <Link to='/profile'>
            <img
                  src={person} // Replace with your profile image path
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white hover:border-yellow-400 transition-all duration-300"
                /></Link>
            
            
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}



