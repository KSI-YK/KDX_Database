import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import CreateProject from '@/components/project/CreateProject'
import ProjectList from '@/components/project/ProjectList'



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
        <ProjectList />
      </main>
      <Footer />
    </>
  );
};

export default Home;
