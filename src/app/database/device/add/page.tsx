import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import * as Device from '@/components/device/index';
import prisma from '@/app/lib/prisma';


export default async function ClientPage() {
  const clients = await prisma.clients.findMany();
  const user = await prisma.user.findMany();

  return (
    <>
      <Header />
      <main>
          <Device.Create 
            clients={clients}
            user={user}
          />
      </main>
      <Footer />
    </>
  );
};
