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
    await main();
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
      });
    return NextResponse.json({message: "Success", projects}, {status: 200});

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
    const clients = await prisma.systems.create({data: {name, model, total_cnt, clientId, directorId}});
    return NextResponse.json({message: "Success", clients}, {status: 201});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};
