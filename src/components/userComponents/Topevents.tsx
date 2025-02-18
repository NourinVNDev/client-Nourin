const events = [
    { title: 'Rome, Italy', price: '$5,42k', duration: '10 Days Trip', image: '/placeholder.svg?height=200&width=300' },
    { title: 'London, UK', price: '$4.2k', duration: '12 Days Trip', image: '/placeholder.svg?height=200&width=300' },
    { title: 'Full Europe', price: '$15k', duration: '28 Days Trip', image: '/placeholder.svg?height=200&width=300' },
  ];
  
  export default function TopEvents() {
    return (
      <section className="py-20 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Top Selling Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-56 object-cover transition-transform transform hover:scale-105"
                  style={{ width: '100%', height: '200px' }}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-lg text-gray-700 mb-4">{event.duration}</p>
                  <p className="text-3xl font-bold text-blue-600">{event.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
