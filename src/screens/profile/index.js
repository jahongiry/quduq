import { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Table,
  Group,
  Text,
  ActionIcon,
  Menu,
  rem,
  ScrollArea,
  Title,
  Select,
  Modal,
  Button,
  TextInput,
  PasswordInput,
  Loader,
  Tooltip
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash, IconArrowBackUp, IconUserPlus, IconLogout, IconChevronRight } from '@tabler/icons-react';
import { useLoading, useUser, useUsers } from 'redux/selectors';
import { useDispatch } from 'react-redux';
import { setUsers } from 'redux/users';
import { createUser, getUsers, me, updateUser, updateUserStatus, userDelete } from 'api';
import { toast } from 'react-toastify';
import { setLoading } from 'redux/loading';
import { setUser } from 'redux/user';
import { userUpdateMessage, userStatusMessage, userDeletedMessage } from 'utils';
import { sendMessage } from 'components/request-modal';
import { useSearchParams } from 'react-router-dom';

const rolesData = [
  { value: 'true', label: 'SuperAdmin' },
  { value: 'false', label: 'Nazoratchi' }
];

export default function ProfileSuperUser() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const user = useUser();
  const loading = useLoading();
  const [opened, { open, close }] = useDisclosure(false);
  const [editForm, setEditForm] = useState({ open: false });
  const users = useUsers();
  const [menuOpened, setMenuOpened] = useState(false);

  const getAllUsers = useCallback(() => {
    if (user?.is_superuser) {
      dispatch(setLoading(true));
      getUsers()
        .then(({ data }) => dispatch(setUsers(data)))
        .catch((err) => {
          console.log('====================================');
          console.log(err);
          toast.error(err?.message || 'Error');
          console.log('====================================');
        })
        .finally(() => dispatch(setLoading(false)));
    }
  }, [dispatch, user?.is_superuser]);

  useEffect(() => {
    if (!users?.length) getAllUsers();
  }, [getAllUsers, users?.length]);

  const isUser = (item) => user.user_id === item.user_id;

  const handleUpdateUserStatus = (value, _user) => {
    if (String(_user?.is_superuser) === value) return null;
    dispatch(setLoading(true));
    console.log('====================================');
    console.log(value);
    console.log('====================================');
    updateUserStatus(user?.user_id, value)
      .then(({ data }) => {
        dispatch(setLoading(false));
        getAllUsers();
        toast.success(data?.message || '✅');
        onClose();
        sendMessage(
          userStatusMessage({
            superAdminUsername: user?.username,
            adminName: _user?.name + ' ' + _user?.surname,
            adminUsername: _user?.username,
            status: rolesData.find((item) => item?.value === value)?.label
          }),
          setLoading,
          close
        );
      })
      .catch((err) => {
        dispatch(setLoading(false));
        console.log('====================================');
        console.log(err);
        toast.error(err?.message || 'Error');
        console.log('====================================');
      });
  };

  const deleteUser = (_user) => {
    dispatch(setLoading(true));
    userDelete(_user?.user_id)
      .then(({ data }) => {
        dispatch(setLoading(false));
        getAllUsers();
        toast.success(data?.message || '✅');
        onClose();
        if (user?.user_id === _user?.user_id) {
          sendMessage(userDeletedMessage({ user: null, admin: user }), setLoading, close);
          window.location.reload();
        } else {
          sendMessage(userDeletedMessage({ user: _user, admin: user }), setLoading, close);
        }
      })
      .catch((err) => {
        dispatch(setLoading(false));
        console.log('====================================');
        console.log(err);
        toast.error(err?.message || 'Error');
        console.log('====================================');
      });
  };

  const noEditedForm = (userForm) =>
    Boolean(
      !Object.keys(form.values).filter((item) => {
        return userForm?.[item]?.trimEnd() !== form.values?.[item]?.trimEnd();
      }).length
    );

  const rows = users
    .filter((user) => !isUser(user))
    .map((item, key) => (
      <Table.Tr
        id={item?.username}
        key={item.name + key}
        bg={searchParams.get('username') === item?.username ? 'var(--mantine-color-dark-5)' : undefined}
      >
        <Table.Td>
          <Group gap="sm">
            <Avatar />
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{item.surname}</Table.Td>
        <Table.Td>{item.username}</Table.Td>
        <Table.Td>
          <Select
            data={rolesData}
            defaultValue={String(item.is_superuser)}
            onChange={(value) => handleUpdateUserStatus(value, item)}
            variant="unstyled"
            allowDeselect={false}
          />
        </Table.Td>
        <Table.Td>
          <Group gap={0} justify="flex-end">
            <ActionIcon variant="subtle" color="gray" onClick={() => setEditedForm(item)}>
              <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
            <Menu transitionProps={{ transition: 'pop' }} withArrow position="bottom-end" withinPortal>
              <Menu.Target disabled={isUser(item)}>
                <ActionIcon variant="subtle" color="gray">
                  <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item c={'green'} leftSection={<IconArrowBackUp style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
                  {"Yo'q"}
                </Menu.Item>
                <Menu.Item
                  onClick={() => deleteUser(item)}
                  c={'red'}
                  leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                >
                  Ha
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));

  const form = useForm({
    initialValues: { username: '', password: '', name: '', surname: '' }
  });

  const setEditedForm = (user) => {
    form.setValues({
      username: user?.username,
      password: user?.password,
      name: user?.name,
      surname: user?.surname
    });
    setEditForm({ open: true, user });
    open();
  };

  const onClose = () => {
    close();
    setEditForm({ open: false });
    editForm.open && form.reset();
  };

  const onSubmit = (values) => {
    dispatch(setLoading(true));
    if (editForm?.user) {
      updateUser(editForm?.user?.user_id, values)
        .then(({ data }) => {
          dispatch(setLoading(false));
          if (editForm?.user?.user_id === user?.user_id) {
            const storageData = localStorage['user-data-web-site-wells'];
            me(storageData)
              .then(({ data }) => {
                dispatch(setUser(data));
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            getAllUsers();
          }
          sendMessage(
            userUpdateMessage({
              adminName: values?.name + ' ' + values?.surname,
              adminUsername: values?.username,
              thisUser: editForm?.user?.user_id === user?.user_id,
              user
            }),
            setLoading,
            close
          );
          toast.success(data?.message || '✅');
          onClose();
          form.reset();
        })
        .catch((err) => {
          dispatch(setLoading(false));
          console.log('====================================');
          console.log(err);
          toast.error(err?.message || 'Error');
          console.log('====================================');
        });
    } else {
      createUser(values)
        .then(({ data }) => {
          dispatch(setLoading(false));
          getAllUsers();
          toast.success(data?.message || '✅');
          onClose();
          form.reset();
        })
        .catch((err) => {
          dispatch(setLoading(false));
          console.log('====================================');
          console.log(err);
          toast.error(err?.message || 'Error');
          console.log('====================================');
        });
    }
  };

  useEffect(() => {
    if (searchParams.get('username') === user?.username) {
      setMenuOpened(true);
    } else {
      const scrollToHashElement = () => {
        const elementToScroll = document.getElementById(searchParams.get('username'));

        if (!elementToScroll) return;

        elementToScroll.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        });
      };

      setTimeout(() => {
        scrollToHashElement();
      }, 1000);
      window.addEventListener('DOMContentLoaded', scrollToHashElement);
      return window.removeEventListener('DOMContentLoaded', scrollToHashElement);
    }
  }, [searchParams, user?.username]);

  const logOut = () => {
    dispatch(setUser({}));
    localStorage.clear();
  };

  return (
    <>
      <Group align="center" justify="space-between">
        <Title c="dimmed" my={'md'}>
          {"Nazoratchilar ro'yxati"}
        </Title>
        <Menu
          transitionProps={{ transition: 'pop' }}
          opened={menuOpened}
          onChange={setMenuOpened}
          withArrow
          position="bottom-end"
          withinPortal
        >
          <Menu.Target>
            <Group>
              <Avatar radius="xl" />
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {`${user?.name} ${user?.surname}`}
                </Text>

                <Text c="dimmed" size="xs">
                  Super Admin
                </Text>
              </div>

              <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
            </Group>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => setEditedForm(user)}
              leftSection={<IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            >
              Profilni yangilash
            </Menu.Item>
            <Menu.Item onClick={logOut} c={'lime'} leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
              Akkauntdan chiqish
            </Menu.Item>
            <Menu.Item
              onClick={() => deleteUser(user)}
              c={'red'}
              leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            >
              {"Akkauntni butunlay o'chirish"}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Group m="lg" justify="flex-end">
        <Button onClick={open}>
          <IconUserPlus />
          <Text px={'md'}>Yangi nazoratchi tayinlash</Text>
        </Button>
      </Group>
      <ScrollArea maw={'calc(100dvw - 32px)'}>
        <Table.ScrollContainer minWidth={600} my={'md'}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Ism</Table.Th>
                <Table.Th>Familiya</Table.Th>
                <Table.Th>Username</Table.Th>
                <Table.Th>Lavozim</Table.Th>
                <Table.Th ta={'right'}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {loading ? (
                <Table.Tr>
                  <Table.Td ta={'center'} colSpan={5}>
                    <Loader />
                  </Table.Td>
                </Table.Tr>
              ) : null}
              {rows.length ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text fw={500} ta="center">
                      Nazoratchilar topilmadi
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Modal
          opened={opened}
          onClose={onClose}
          title={
            user?.user_id === editForm.user?.user_id
              ? 'Profilni yangilash'
              : editForm.open
              ? "Nazoratchini ma'lumotini yangilash"
              : 'Yangi nazoratchi tayinlash'
          }
          centered
        >
          <form autoComplete="off" onSubmit={form.onSubmit(onSubmit)}>
            <TextInput mt={'md'} label="Ism" placeholder="ism" type="text" required {...form.getInputProps('name')} />
            <TextInput mt={'md'} label="Familiya" placeholder="surname" type="text" required {...form.getInputProps('surname')} />
            <TextInput mt={'md'} label="Username" placeholder="username" type="text" required {...form.getInputProps('username')} />
            {!editForm.open && <PasswordInput mt={'md'} label="Parol" placeholder="Parol kiriting" {...form.getInputProps('password')} />}

            <Tooltip
              color={noEditedForm(editForm.user) ? 'red ' : 'blue'}
              label={noEditedForm(editForm.user) ? "O'zgarish kiritilmagan" : 'Yuborish'}
            >
              <Button disabled={editForm.user?.user_id && noEditedForm(editForm.user)} type="submit" fullWidth mt="xl" loading={loading}>
                {user?.user_id === editForm.user?.user_id
                  ? 'Profilni yangilash'
                  : editForm.open
                  ? "Nazoratchini ma'lumotini yangilash"
                  : 'Yangi nazoratchi tayinlash'}
              </Button>
            </Tooltip>
          </form>
        </Modal>
      </ScrollArea>
    </>
  );
}
