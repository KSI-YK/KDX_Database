import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import SystemList from '@/components/system/SystemList';

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
        <SystemList />
      </main>
      <Footer />
    </>
  );
};

export default Home;
