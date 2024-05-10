import { useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Paper, Title, Container, Button } from '@mantine/core';
import classes from './login.module.css';
import { setUser } from 'redux/user';
import { login, me } from 'api';
import { getFormData } from 'utils';
import { setLoading } from 'redux/loading';
import { useLoading } from 'redux/selectors';
import { toast } from 'react-toastify';

export default function Login() {
  const loading = useLoading();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: { username: '', password: '' }
  });
  const onSubmit = (values) => {
    dispatch(setLoading(true));
    login(getFormData(values))
      .then(({ data: { access_token } }) => {
        me(access_token)
          .then(({ data }) => {
            dispatch(setLoading(false));
            dispatch(setUser(data));
            toast.success('✅');
            localStorage.setItem('user-data-web-site-wells', access_token);
            navigate('/wells');
          })
          .catch((err) => {
            dispatch(setLoading(false));
            console.log('====================================');
            console.log(err);
            console.log('====================================');
          });
      })
      .catch((err) => {
        dispatch(setLoading(false));
        console.log('==============={err}=====================');
        console.log(err);
        toast.error(err?.message || 'Error');
        console.log('==============={err}=====================');
      });
  };
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Nazoratchilar uchun!
      </Title>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Username" placeholder="ok@mail.co" type="text" required {...form.getInputProps('username')} />
          <PasswordInput label="Parolingiz" placeholder="Parolingizni kiriting" required mt="md" {...form.getInputProps('password')} />
          <Button loading={loading} type="submit" fullWidth mt="xl">
            Kirish
          </Button>
        </Paper>
      </form>
    </Container>
  );
}
