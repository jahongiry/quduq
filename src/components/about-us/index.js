import { Title, SimpleGrid, Text, ThemeIcon, Grid, rem } from '@mantine/core';
import { IconAlertSmall, IconEyeCheck, IconComponents, IconStack } from '@tabler/icons-react';
import classes from './about-us.module.css';
import RequestModal from 'components/request-modal';

const features = [
  {
    icon: IconAlertSmall,
    title: "Zaruriy ma'lumotlar",
    description: "Qisqacha yangilik va zaruriy ma'lumotlar va sohadagi islohotlar haqida"
  },
  {
    icon: IconEyeCheck,
    title: 'Online kuzatuv',
    description: 'Nazoratdagi quduqlarni onlayn kuzatish'
  },
  {
    icon: IconComponents,
    title: 'Qurilmalar',
    description: 'Smart Water Inspecrot qurilmalar boshqaruvi'
  },
  {
    icon: IconStack,
    title: 'Statistika',
    description: 'Nazorat quduqlarini onlayn monitoring qilish dasturlari'
  }
];

export default function AboutUs() {
  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon size={44} radius="md" variant="gradient" gradient={{ deg: 133, from: 'blue', to: 'cyan' }}>
        <feature.icon style={{ width: rem(26), height: rem(26) }} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      <Grid gutter={80}>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Title ta={'center'} className={classes.title} order={2}>
            Kompaniya maqsadi
          </Title>

          <Text
            c="dimmed"
            fw={700}
            ta={'center'}
            style={{
              textWrap: 'balance'
            }}
            m={'lg'}
          >
            {`
              Irrigasiya va melioratsiya ishlarini oliy sifatda bajarish orqali qishloq ho‘jaligini suv bilan
              ta'minlash va uni iqtisod qilish masalasini xal etish.
            `}
          </Text>
          <hr />
          <Text
            c="dimmed"
            mt={'lg'}
            ta={'justify'}
            style={{
              textWrap: 'balance'
            }}
          >
            <br />
            {`"Raqamli O'zbekiston 2030" strategiyasini tasdiqlash va uni samarali amalga oshirish qatorida, suv xo'jaligi boshqarmasida ham
            islohotli ishlar amalga oshirilmoqda. Binobarin O'zbekiston Respublikasi Prezidentining 2020-yil 10-iyuldagi PF-6024-son
            Farmoniga binoan suv resurslarini boshqarish tizimini takomillashtirish, suvdan foydalanish va suv iste'moli hisobini yuritishda
            "Smart Water" ("Aqlli suv") va shu kabi raqamli texnologiyalarni joriy qilish zarurligi aytildi.`}
          </Text>

          <RequestModal />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
            {items}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </div>
  );
}
