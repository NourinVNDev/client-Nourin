import Header from '../../components/userComponents/Headers';
import Hero from '../../components/userComponents/Hero';
import About from '../../components/userComponents/About';
import Features from '../../components/userComponents/Features';
import Subscribe from '../../components/userComponents/Subscribe';
import Footer from '../../components/userComponents/Footer';
import { Toaster } from 'react-hot-toast';


export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />

      <main>
        <Hero />
        <About />
        <Features />
        {/* <TopEvents /> */}
        <Subscribe />
      </main>
      <Footer />
    </div>
  )
}

