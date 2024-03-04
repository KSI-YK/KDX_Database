// pages/index.tsx
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';
import UserList from '@/components/UserList';

interface User {
  id: number;
  name: string;
  email: string;
}

interface HomeProps {
  users: User[];
}


const Home: React.FC<HomeProps> = ({ users }) => {
  return (
    <>
      <Header />
      <main>
        <UserList />
        <Hero />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
};

export default Home;
