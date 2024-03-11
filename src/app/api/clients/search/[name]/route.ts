// pages/api/clients.ts
import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { main } from '../../route';

// http://localhost:3000/api/clients/search/{id}
// idで指定されたクライアントを取得
export const GET = async (req: Request, res: NextResponse) => {
    try {
        const searchNameEncoded = req.url.split("/clients/search/")[1];
        const searchName = decodeURIComponent(searchNameEncoded);
        await main();
        const clients = await prisma.clients.findMany({
            where: {
                name: {
                    contains: searchName
                }
            }
        });
        return NextResponse.json({ message: "Success", clients }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: "Error" }, { status: 500 });

    } finally {
        await prisma.$disconnect();
    }
};
