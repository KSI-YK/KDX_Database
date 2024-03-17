import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import { Hero } from '@/components/Hero';


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
        <Hero />
      </main>
      <Footer />
    </>
  );
};

export default Home;
