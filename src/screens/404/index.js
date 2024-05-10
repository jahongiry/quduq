import { Container, Title, Text, Button, Group } from '@mantine/core';
import classes from './404.module.css';
import { NotFound404 } from 'assets/img/svg';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <NotFound404 className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>{"Bu erda ko'rish uchun hech narsa yo'q"}</Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
            {
              "Siz ochmoqchi bo'lgan sahifa mavjud emas. Siz manzilni noto'g'ri yozgan bo'lishingiz yoki sahifa boshqa URL manziliga ko'chirilgan bo'lishi mumkin. Agar siz bu xato aloqa qo'llab-quvvatlash, deb o'ylayman."
            }
          </Text>
          <Group justify="center" mt={'lg'}>
            <Button size="md" onClick={() => navigate('/')}>
              Asosiyga qaytish
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
