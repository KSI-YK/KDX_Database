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
    const splitName = searchName.split("&");
    const clientName = splitName[0]
    const directorName = splitName[1]
    const systemName = splitName[2]
    await main();
    // 検索条件のオブジェクトを動的に構築
    let whereClause: any = {};

    if (systemName) {
      whereClause.name = {
        contains: systemName,
      };
    }

    if (clientName) {
      whereClause.client = {
        name: {
          contains: clientName,
        },
      };
    }

    if (directorName) {
      whereClause.director = {
        name: {
          contains: directorName,
        },
      };
    }

    const systems = await prisma.systems.findMany({
      include: {
        director: true,
        client: true,
      },
      orderBy: {
        updatedAt: 'desc'
      },
      where: whereClause,
    });
    return NextResponse.json({ message: "Success", systems }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
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

