
import React from 'react';
import { UserProvider } from '../contexts/UserContext';
import Layout from '../components/Layout';
import MainContent from '../components/MainContent';

const IndexContent = () => {
  return <MainContent />;
};

const Index = () => {
  return (
    <UserProvider>
      <Layout>
        <IndexContent />
      </Layout>
    </UserProvider>
  );
};

export default Index;
