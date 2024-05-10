import { ThemeIcon, Text, Title, Container, SimpleGrid, rem } from '@mantine/core';
import { IconCookie, IconTemperature, IconMessage2, IconInfinity, IconBatteryEco, IconWaterpolo } from '@tabler/icons-react';
import classes from './features.module.css';
import { Link } from 'react-router-dom';

export const MOCKDATA = [
  {
    icon: IconWaterpolo,
    title: 'Suv sathi nazorati',
    description: "Suv sathini o'lchash 7metrgacha, o'lchash aniqligi esa 1sm"
  },
  {
    icon: IconTemperature,
    title: 'Harorat nazorati',
    description: 'Harorat nazorati 0°dan +50°gacha'
  },
  {
    icon: IconCookie,
    title: "Sho'rlanish darajasi nazorati",
    description: "Sho'rlanish darajasi nazorati o'lchov birligi EC²⁵"
  },
  {
    icon: IconInfinity,
    title: 'Serverga ulanish',
    description: "Serverga qurilmalar ulanish miqdori ∞. Qurilmalar orqali olingan ma'lumotlar bazasi sig'imi ∞ (cheklanmagan)"
  },
  {
    icon: IconMessage2,
    title: '24/7 Support',
    description: 'Doimiy nazorat , 24/7 Support'
  },
  {
    icon: IconBatteryEco,
    title: 'Batareya',
    description: 'Batareya turi 6v-15v'
  }
];

export default function Features() {
  const features = MOCKDATA.map((feature, index) => (
    <div key={index}>
      <ThemeIcon variant="light" size={40} radius={40}>
        <feature.icon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7}>
        {feature.title}
      </Text>
      <Text size="sm" c="dimmed" style={{ textWrap: 'balance' }} lh={1.6}>
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <Container className={classes.wrapper}>
      <Title size="sm" hiddenFrom="sm">
        <Link to={'/wells'} className={classes.link}>
          {"Barcha Quduqlarni Ko'rish"}
        </Link>
      </Title>
      <Title className={classes.title}>Xizmatlar</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          Bizning ushbu sifatli hizmatlarimizdan foydalanishingiz mumkin
        </Text>
      </Container>

      <SimpleGrid mt={60} cols={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 'xl', md: 50 }} verticalSpacing={{ base: 'xl', md: 50 }}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
