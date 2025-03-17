const Footer=()=>{
    return (
        <div>
            <footer className="bg-gray-100 text-center py-6 border-t w-full">
      <br /><br /><br />
        <div className="grid grid-cols-3 gap-4 px-8">
          <div className="text-left">
          
            <h5 className="font-bold text-black">MeetCraft</h5>
            <p className="text-gray-700">Book your favorate events in minutes and enjoy seamless management.</p>
            <p className="text-gray-700">Contact us at support@meetcraft@gmail.com</p>
          </div>
          <div>
            <h5 className="font-bold text-black">Company</h5>
            <ul className="text-gray-700">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-black">Discover</h5>
            <ul className="text-gray-700">
              <li>Features</li>
              <li>Pricing</li>
              <li>FAQs</li>
              <li>Blog</li>
            </ul>
          </div>
        </div>
      </footer>
        </div>
    )
}
export default Footer;