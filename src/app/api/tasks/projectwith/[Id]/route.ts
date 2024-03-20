import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function main() {
  try {
    await prisma.$connect()
  } catch (err) {
    return Error('DB接続に失敗しました')
  }
}

// clientIdで指定されたシステムを取得
export const GET = async (req: Request, res: NextResponse) => {
  try {
    const projectId: string = req.url.split('/tasks/projectwith/')[1]
    await main()
    const tasks = await prisma.tasks.findMany({
      include: {
        director: true,
        creator: true,
        status: true,
      },
      where: {
        projectId: projectId as string,
      },
      orderBy: {
        updatedAt: 'desc',
        // updatedAt: 'asc',
      },
    })
    return NextResponse.json({ message: 'Success', tasks }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
