import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { main } from '../route';

// idで指定されたクライアントを取得
export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const id: string = req.url.split("/tasks/")[1];
    await main();

    let {
      name,
      typeId,
      statusId,
      creatorId,
      directorId,
      managers,
      startDate,
      endDate,
    } = await req.json()

    // 既存の managers リレーションをクリア
    await prisma.tasks.update({
      where: { id },
      data: {
        managers: {
          set: [], // 既存のすべての関連付けをクリア
        },
      },
    });

    // 新しい managers リレーションを追加
    const tasks = await prisma.tasks.update({
      where: { id },
      data: {
        name,
        typeId,
        statusId,
        creatorId,
        directorId,
        // 新しい managers リレーションを設定
        managers: {
          connect: managers.map((managerId: string) => ({ id: managerId })),
        },
        startDate,
        endDate,
      },
    });

    return NextResponse.json({ message: "Success", tasks }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
};
