import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Logos from "../components/Logos";
import CallToAction from "../components/CallToAction";
import LoginPage from "./auth/login/page";
import RegisterPage from "./auth/register/page";

export default function HomePage() {
  return (
    <>
      {/* <Hero /> */}
      <CallToAction />
      <Features />
      <HowItWorks />
      
      
     
    </>
  );
}
