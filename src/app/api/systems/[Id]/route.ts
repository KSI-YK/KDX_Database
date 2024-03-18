import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { main } from '../route';

// idで指定されたクライアントを取得
export const GET = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/systems/")[1];
    await main();
    const systems = await prisma.systems.findFirst({
      include: {
        director: true,
        client: true,
      },
      where: { id } });

    return NextResponse.json({ message: "Success", systems }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
};

// idで指定されたクライアントをアップデート
export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/systems/")[1];
    const {name, model, total_cnt, clientId, directorId} = await req.json();
    await main();
    const systems = await prisma.systems.update({
      data: {name, model, total_cnt, clientId, directorId},
      where: {id},
    });
    return NextResponse.json({message: "Success", systems}, {status: 200});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};

// idで指定されたクライアントを削除
export const DELETE = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/systems/")[1];
    await main();
    const systems = await prisma.systems.delete({
      where: {id},
    });
    return NextResponse.json({message: "Success", systems}, {status: 200});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};