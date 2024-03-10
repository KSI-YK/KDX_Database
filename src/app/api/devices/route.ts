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
    const devices = await prisma.devices.findMany();
    return NextResponse.json({message: "Success", devices}, {status: 200});
  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const {name,  } = await req.json();
    await main();
    const devices = await prisma.clients.create({data: {name}});
    return NextResponse.json({message: "Success", devices}, {status: 201});
  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});
  } finally {
    await prisma.$disconnect();
  }
};

