import HeroSection from "../../components/HomePage/HeroSection";
import IconSection from "../../components/HomePage/IconSection";
import Testinomial from "../../components/HomePage/Testinomial";
import Footer from "../../components/shared/Footer";
import NavBar from "../../components/shared/NavBar";

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
