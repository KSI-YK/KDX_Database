import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import * as Device from '@/components/device/index';
import prisma from '@/lib/prisma';


export default async function ClientPage({ params }: { params: { id: string } }, ) {
    const deviceID = params.id
    const deviceWithClient = await prisma.devices.findFirst({
        where: {
            id: deviceID,
        },
        include: {
            system: {
                include: {
                    client: true, // システムに関連するクライアント情報も取得します
                },
            },
            director: true,
        }, 
    });

    const clientName: string | undefined = deviceWithClient?.system.client.name
    const systemName: string | undefined = deviceWithClient?.system.name

    const user = await prisma.user.findMany();

    return (
        <>
            <Header />
            <main className='pt-14'>
                <Device.Edit 
                    id={deviceID}
                    clientName={clientName}
                    systemName={systemName}
                    device={deviceWithClient}
                    users={user}
                />
            </main>
            <Footer />
        </>
    );
};
