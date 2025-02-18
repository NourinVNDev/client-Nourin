import video from '../../../src/assets/banner-intro.webm';
export default function Hero() {
    return (
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left Section */}
            <div className="lg:w-3/5 lg:pr-12 mb-10 lg:mb-0">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Best Events Around the World
              </h1>
              <p className="text-xl text-white mb-6 opacity-90">
                Create, innovate, and embrace a journey of endless possibilities.
              </p>
              <p className="text-lg mb-6 opacity-80">
                At VisionGrid, we curate unforgettable events, from corporate conferences to cultural festivals. Let’s make memories together.
              </p>
              <button className="px-8 py-4 text-lg font-semibold bg-blue-700 rounded-lg shadow-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105">
                Book Packages
              </button>
            </div>
  
            {/* Right Section */}
            <div className="lg:w-2/5 relative flex justify-center items-center">
              <div className="relative w-96 h-96 lg:w-120 lg:h-120 rounded-full overflow-hidden border-8 border-white shadow-xl transform hover:scale-105 transition-all duration-500">
                <video
                  className="rounded-full object-cover w-full h-full"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  {/* Reference to video inside public folder */}
                  <source src={video} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105"
                    aria-label="Play video"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-8 h-8 text-blue-600"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-5.197-3.028A1 1 0 008 8.962v6.076a1 1 0 001.555.832l5.197-3.028a1 1 0 000-1.664z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  