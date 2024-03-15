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
    const searchNameEncoded = req.url.split("/devices/search/")[1];
    const searchName = decodeURIComponent(searchNameEncoded);
    const splitName = searchName.split("&");
    const clientName = splitName[0]
    const directorName = splitName[1]
    const systemName = splitName[2]
    const deviceName = splitName[3]

    await main();
    // 検索条件のオブジェクトを動的に構築
    let whereClause: any = {};

    if (systemName) {
      whereClause.system = {
        name: {
          contains: systemName,
        },
      };
    }

    if (deviceName) {
      whereClause.name = {
        contains: deviceName,
      };
    }

    if (clientName) {
      whereClause.system = {
        client: {
          name: {
            contains: clientName,
          },
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

    const devices = await prisma.devices.findMany({
      include: {
        director: true,
        system: {
          include: {
            client: true,
          },
        },
      },
      orderBy: [{
        updatedAt: 'desc',
      },{
        name: 'desc',
      },
    ],
      where: whereClause,
    });
    return NextResponse.json({ message: "Success", devices }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const {name, model, systemId, directorId} = await req.json();

    await main();
    const devices = await prisma.devices.create({data: {name, model, systemId, directorId}});
    return NextResponse.json({message: "Success", devices}, {status: 201});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};

