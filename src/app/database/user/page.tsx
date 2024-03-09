import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
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
        <CreateUser />
        <UserList />
      </main>
      <Footer />
    </>
  );
};

export default Home;
