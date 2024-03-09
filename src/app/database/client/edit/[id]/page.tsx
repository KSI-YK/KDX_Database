import Header from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import * as Client from '@/components/client/index';

const ClientPage = ({ params }: { params: { id: string } }) => {

    const clientID = params.id
    return (
        <>
            <Header />
            <main>
                <Client.Edit params={{ id: clientID }} />
            </main>
            <Footer />
        </>
    );
};

export default ClientPage;
