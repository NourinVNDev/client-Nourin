import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* VisionGrid Section */}
          <div>
            <h3 className="text-3xl font-extrabold text-blue-500 mb-4">MeetCraft</h3>
            <p className="text-gray-400 text-lg">
              Book your trip in minutes, get full control for much longer.
            </p>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition duration-300">About</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-white transition duration-300">Careers</Link></li>
              <li><Link to="/mobile" className="text-gray-400 hover:text-white transition duration-300">Mobile</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">Contact</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-400 hover:text-white transition duration-300">Help/FAQ</Link></li>
              <li><Link to="/press" className="text-gray-400 hover:text-white transition duration-300">Press</Link></li>
              <li><Link to="/affiliates" className="text-gray-400 hover:text-white transition duration-300">Affiliates</Link></li>
            </ul>
          </div>

          {/* More Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">More</h4>
            <ul className="space-y-3">
              <li><Link to="/airlinefees" className="text-gray-400 hover:text-white transition duration-300">Airline Fees</Link></li>
              <li><Link to="/airline" className="text-gray-400 hover:text-white transition duration-300">Airlines</Link></li>
              <li><Link to="/tips" className="text-gray-400 hover:text-white transition duration-300">Low Fare Tips</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-lg">
            &copy; {new Date().getFullYear()} MeetCraft. All rights reserved.
          </p>
          <div className="mt-4 space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
