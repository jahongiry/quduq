// import React from 'react';
import { Container, Flex, ScrollArea } from '@mantine/core'
import Footer from 'components/footer'
import Header from 'components/header'
import { Route, Routes } from 'react-router-dom'
import routes from 'routes'

const App = () => {
  return (
    <ScrollArea h={'100dvh'}>
      <Flex direction={'column'} h={'100dvh'} justify={'space-between'}>
        <Container size={'xl'} w={'100%'}>
          <Header />
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </Routes>
        </Container>
        <Footer />
      </Flex>
    </ScrollArea>
  );
};

export default App;
