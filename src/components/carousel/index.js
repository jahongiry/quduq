import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import {
  Paper,
  // Text, Title, Button,
  useMantineTheme,
  rem
} from '@mantine/core';
import classes from './carousel.module.css';
import '@mantine/carousel/styles.css';
import Autoplay from 'embla-carousel-autoplay';

const data = [
  {
    image: require('../../assets/img/slider-img.jpg'),
    title: 'Best forests to visit in North America',
    category: 'nature'
  },
  {
    image: require('../../assets/img/slider-img-1.jpg'),
    title: 'Hawaii beaches review: better than you think',
    category: 'beach'
  },
  {
    image: require('../../assets/img/slider-img-2.jpg'),
    title: 'Mountains at night: 12 best locations to enjoy the view',
    category: 'nature'
  },
  {
    image: require('../../assets/img/slider-img-3.jpg'),
    title: 'Aurora in Norway: when to visit for best experience',
    category: 'nature'
  },
  {
    image: require('../../assets/img/slider-img-4.png'),
    title: 'Best places to visit this winter',
    category: 'tourism'
  },
  {
    image: require('../../assets/img/slider-img-5.jpg'),
    title: 'Active volcanos reviews: travel at your own risk',
    category: 'nature'
  }
];

export default function CardsCarousel() {
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = data.map((item) => (
    <Carousel.Slide key={item.title}>
      <Paper shadow="md" p="xl" radius="md" style={{ backgroundImage: `url(${item.image})` }} className={classes.card}>
        {/* <div>
          <Text className={classes.category} size="xs">
            {item.category}
          </Text>
          <Title order={3} className={classes.title}>
            {item.title}
          </Title>
        </div>
        <Button variant="white" color="dark">
          Read article
        </Button> */}
      </Paper>
    </Carousel.Slide>
  ));

  return (
    <Carousel
      maw={'calc(100dvw - 32px)'}
      slideSize={{ base: '100%', sm: '50%' }}
      slideGap={{ base: rem(2), sm: 'xl' }}
      align="start"
      slidesToScroll={mobile ? 1 : 2}
      plugins={[autoplay.current]}
      loop
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.play}
    >
      {slides}
    </Carousel>
  );
}
