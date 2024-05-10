import AboutUs from 'components/about-us';
import CarouselCard from 'components/carousel';
import Features from 'components/features';
import React from 'react';

const Home = () => {
  return (
    <div>
      <CarouselCard />
      <Features />
      <AboutUs />
    </div>
  );
};

export default Home;
