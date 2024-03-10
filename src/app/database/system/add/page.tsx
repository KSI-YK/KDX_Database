import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import * as System from '@/components/system/index';

const ClientPage = () => {
  return (
    <>
      <Header />
      <main>
        <System.Create />
      </main>
      <Footer />
    </>
  );
};

export default ClientPage;
