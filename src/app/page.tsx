import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import UserList from '@/components/UserList';
import UserAdd from '@/components/UserAdd';


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
        <UserAdd />
      </main>
      <Footer />
    </>
  );
};

export default Home;
