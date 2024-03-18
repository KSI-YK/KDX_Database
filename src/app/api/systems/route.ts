import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// クライアントの型を定義（データベースのスキーマに応じて変更）
// interface Client {
//   id: string;
//   name: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

export async function main() {
  try {
    await prisma.$connect();
    
  } catch (err) {
    return Error("DB接続に失敗しました");
  }
}

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main();
    const systems = await prisma.systems.findMany({
        include: {
          director: true,
          client: true,
        },
        orderBy: {
          updatedAt: 'desc'
        },
      });
    return NextResponse.json({message: "Success", systems}, {status: 200});
  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const {name, model, total_cnt, clientId, directorId} = await req.json();
    await main();
    const systems = await prisma.systems.create({data: {name, model, total_cnt, clientId, directorId}});
    return NextResponse.json({message: "Success", systems}, {status: 201});
  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
};
