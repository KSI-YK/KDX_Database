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
    const status = await prisma.status.findMany();
    return NextResponse.json({message: "Success", status}, {status: 200});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};

