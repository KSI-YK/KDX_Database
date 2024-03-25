import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import * as Project from '@/components/project/index';
import prisma from '@/lib/prisma';

export default async function ClientPage() {
  const clients = await prisma.clients.findMany();
  const systems = await prisma.systems.findMany();
  const devices = await prisma.devices.findMany();
  const user = await prisma.user.findMany();
  const projectTypes = await prisma.projectTypes.findMany();
  const status = await prisma.status.findMany();

  // const initSystems = systems.map((system) => ({ value: system.id, label: system.name }))
  // const initDevices = devices.map((device) => ({ value: device.id, label: device.name }))

  

  return (
    <>
      <Header />
      <main className='pt-14'>
          <Project.Create
            clients={clients}
            initSystems={systems}
            initDevices={devices}
            user={user}
            projectTypes={projectTypes}
            status={status}
          />
      </main>
      <Footer />
    </>
  );
};
