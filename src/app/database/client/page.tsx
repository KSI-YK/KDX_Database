import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import * as Client from '@/components/client/index';

const ClientPage = () => {
  return (
    <>
      <Header />
      <main>
        <Client.List />
      </main>
      <Footer />
    </>
  );
};

export default ClientPage;
