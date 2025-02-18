import Header from '../../components/userComponents/Headers';
import Hero from '../../components/userComponents/Hero';
import About from '../../components/userComponents/About';
import Features from '../../components/userComponents/Features';
import TopEvents from '../../components/userComponents/Topevents';
import Subscribe from '../../components/userComponents/Subscribe';
import Footer from '../../components/userComponents/Footer';


export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
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

