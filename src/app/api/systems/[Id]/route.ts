// pages/api/clients.ts
import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { main } from '../route';

// idで指定されたクライアントを取得
export const GET = async (req: Request, res: NextResponse) => {
  try {
    const clientId: string = req.url.split("/systems/")[1];
    await main();
    const client = await prisma.systems.findMany({where: {clientId}});  //http://localhost:3000/api/clients/{id}
    return NextResponse.json({message: "Success", client}, {status: 200});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};
