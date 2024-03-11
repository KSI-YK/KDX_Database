import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import * as System from '@/components/system/index';
import prisma from '@/app/lib/prisma';


export default async function ClientPage({ params }: { params: { id: string } }) {
    const systemID = params.id
    const clients = await prisma.clients.findMany();
    const user = await prisma.user.findMany();

    return (
        <>
            <Header />
            <main>
                <System.Edit 
                    id={systemID}
                    clients={clients}
                    user={user}
                />
            </main>
            <Footer />
        </>
    );
};
