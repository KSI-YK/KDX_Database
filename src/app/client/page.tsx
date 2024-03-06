import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import UserList from '@/components/user/UserList';
import CreateUser from '@/components/user/CreateUser';



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
      </main>
      <Footer />
    </>
  );
};

export default Home;
