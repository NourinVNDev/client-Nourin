export default function Subscribe() {
    return (
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-300">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-white mb-6">
              Subscribe to get the latest news, offers, and updates on our events
            </h2>
            <p className="text-lg text-white mb-8">
              Stay ahead and never miss out on exciting news, offers, and event updates by subscribing to our newsletter.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 rounded-md hover:bg-blue-700 transition-all duration-300"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
  