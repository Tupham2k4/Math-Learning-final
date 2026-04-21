import React from "react";
import Hero from "../Components/Hero/Hero";
import Function from "../Components/Function/Function";
import Introduce from "../Components/Introduce/Introduce";
import Progress from "../Components/Progress/Progress";
import StatsCard from "../Components/StatsCard/StatsCard";
import CallToAction from "../Components/CallToAction/CallToAction";
const Home = () => {
  return (
    <div className="home">
      <Hero />
      <Function />
      <Introduce />
      <Progress />
      <StatsCard />
      <CallToAction />
    </div>
  );
};

export default Home;
