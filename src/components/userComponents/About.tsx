export default function About() {
    return (
      <section className="py-20 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image Section */}
            <div className="lg:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/placeholder.svg"
                  alt="About our events"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
  
            {/* Text Section */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                About Our Events
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                At VisionGrid, we specialize in creating unforgettable event experiences that inspire, connect, and transform. With our innovative approach and cutting-edge technology, we bring your vision to life, whether it's a corporate conference, a cultural festival, or a virtual gathering.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Our team of experienced event professionals is dedicated to crafting every detail, ensuring seamless execution and maximum impact for your attendees. From concept to completion, we're committed to exceeding your expectations and delivering events that leave a lasting impression.
              </p>
              <button
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  