// pages/api/clients.ts

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
    await main();
    const user = await prisma.user.findMany();
    return NextResponse.json({message: "Success", user}, {status: 200});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const {name, username, email, image, hashedPassword, typeId, postId, departmentId} = await req.json();

    await main();
    const user = await prisma.user.create({data: {name, username, email, image, hashedPassword, typeId, postId, departmentId}});
    return NextResponse.json({message: "Success", user}, {status: 201});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};

