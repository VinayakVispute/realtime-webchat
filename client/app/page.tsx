import HeroSection from "@/components/shared/HomePage/HeroSection";
import IconSection from "@/components/shared/HomePage/IconSection";
import Testinomial from "@/components/shared/HomePage/Testinomial";
import Footer from "@/components/shared/Footer";
import NavBar from "@/components/shared/NavBar";
const Home = () => {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <IconSection />
      <Testinomial />
      <Footer />
    </div>
  );
};

export default Home;
