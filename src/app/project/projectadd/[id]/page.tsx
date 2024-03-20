import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import * as System from '@/components/system/index';
import prisma from '@/lib/prisma';


export default async function ClientPage() {
  const clients = await prisma.clients.findMany();
  const user = await prisma.user.findMany();

  return (
    <>
      <Header />
      <main className='pt-14'>
          <System.Create 
            clients={clients}
            user={user}
          />
      </main>
      <Footer />
    </>
  );
};
