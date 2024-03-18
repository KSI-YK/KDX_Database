import prisma from '@/lib/prisma';
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
    const searchNameEncoded = req.url.split("/projects/search/")[1];
    const searchName = decodeURIComponent(searchNameEncoded);
    const splitName = searchName.split("&");
    const clientName = splitName[0]
    const directorName = splitName[1]
    const systemName = splitName[2]
    const deviceName = splitName[3]

    await main();
    // 検索条件のオブジェクトを動的に構築
    let whereClause: any = {};

    if (deviceName) {
      whereClause.name = {
        contains: deviceName,
      };
    }

    if (systemName) {
      whereClause.device = {
        system: {
          name: {
            contains: systemName,
          },
        },
      };
    }

    if (clientName) {
      whereClause.device = {
        system: {
          client: {
            name: {
              contains: clientName,
            },
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

    const projects = await prisma.projects.findMany({
      include: {
        director: true,
        status: true,
        type: true,
        device: {
          include: {
            system: {
              include: {
                client: true,
              },
            },
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
    console.log(projects)
    return NextResponse.json({ message: "Success", projects }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
