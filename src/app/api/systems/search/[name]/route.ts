import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function main() {
  try {
    await prisma.$connect();
  } catch (err) {
    return Error("DB接続に失敗しました");
  }
}

export const GET = async (req: Request, res: NextResponse) => {
  try {
    const searchNameEncoded = req.url.split("/systems/search/")[1];
    const searchName = decodeURIComponent(searchNameEncoded);
    console.log(searchName)
    await main();
    const systems = await prisma.systems.findMany({
      include: {
        director: true,
        client: true,
      },
      where: {
        name: {
          contains: searchName
        }
      }
    });
    return NextResponse.json({ message: "Success", systems }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
};