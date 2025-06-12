import React from "react";
import Header from "./components/Header";
import FeatureHighlights from "./components/FeatureHighlights";
import Footer from "./components/Footer";
import Hero from "../components/Hero";
const Home = () => {
  return(
    <div>
      <FeatureHighlights />
      <Footer />
      <Hero />
      <Header />
    </div>
  );
};

export default Home;
