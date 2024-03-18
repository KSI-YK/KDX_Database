// /Users/hayatoshimada/Desktop/salient-ts/src/app/api/projects/[projectId]/route.ts

import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { main } from '../route';

// idで指定されたクライアントを取得
export const GET = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/projects/")[1];
    await main();
    const devices = await prisma.projects.findFirst({
      include: {
        director: true,
        device: {
          include: {
            system: {
              include: {
                client: true,
              },
            },
          }
        },
      },
      where: { id } });
    return NextResponse.json({ message: "Success", devices }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
};

// idで指定されたクライアントをアップデート
export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/projects/")[1];
    const {name, model, systemId, directorId} = await req.json();
    console.log(name, model, systemId, directorId);
    await main();
    const devices = await prisma.devices.update({
      data: {name, model, systemId, directorId},
      where: {id},
    });
    return NextResponse.json({message: "Success", devices}, {status: 200});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};

// idで指定されたクライアントを削除
export const DELETE = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/devices/")[1];
    await main();
    const devices = await prisma.devices.delete({
      where: {id},
    });
    return NextResponse.json({message: "Success", devices}, {status: 200});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};