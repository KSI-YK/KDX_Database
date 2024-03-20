import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import * as Client from '@/components/client/index';

const ClientPage = () => {
  return (
    <>
      <Header />
      <main className='pt-14'>
        <Client.Create />
      </main>
      <Footer />
    </>
  );
};

export default ClientPage;
