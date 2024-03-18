// pages/api/clients.ts
import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { main } from '../route';

// idで指定されたクライアントを取得
export const GET = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/departments/")[1];
    await main();
    const department = await prisma.departments.findFirst({where: {id}});  //http://localhost:3000/api/clients/{id}
    return NextResponse.json({message: "Success", department}, {status: 200});

  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 500});

  } finally {
    await prisma.$disconnect();
  }
};

// // idで指定されたクライアントをアップデート
// export const PUT = async (req: Request, res: NextResponse) => {
//     try {
//       const id: string = req.url.split("/clients/")[1];
//       const {name} = await req.json();
//       await main();
//       const client = await prisma.clients.update({
//         data: {name},
//         where: {id},
//       });
//       return NextResponse.json({message: "Success", client}, {status: 200});
  
//     } catch (err) {
//       return NextResponse.json({message: "Error"}, {status: 500});
  
//     } finally {
//       await prisma.$disconnect();
//     }
//   };

// // idで指定されたクライアントを削除
// export const DELETE = async (req: Request, res: NextResponse) => {
//     try {
//       const id: string = req.url.split("/clients/")[1];
//       await main();
//       const client = await prisma.clients.delete({
//         where: {id},
//       });
//       return NextResponse.json({message: "Success", client}, {status: 200});
  
//     } catch (err) {
//       return NextResponse.json({message: "Error"}, {status: 500});
  
//     } finally {
//       await prisma.$disconnect();
//     }
//   };