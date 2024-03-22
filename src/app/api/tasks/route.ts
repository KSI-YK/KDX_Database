import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function main() {
  try {
    await prisma.$connect()
  } catch (err) {
    return Error('DB接続に失敗しました')
  }
}

export const GET = async (req: Request, res: NextResponse) => {
  try {
    await main()
    const tasks = await prisma.tasks.findMany({
      include: {
        director: true,
        project: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })
    return NextResponse.json({ message: 'Success', tasks }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export const POST = async (req: Request, res: NextResponse) => {
  try {
    let {
      name,
      typeId,
      statusId,
      creatorId,
      directorId,
      managers,
      projectId,
      startDate,
      endDate,
    } = await req.json()


    await main()

    const tasks = await prisma.tasks.create({
      data: {
        name,
        typeId,
        statusId,
        creatorId,
        directorId,
        managers: {
          connect: managers.map((managerId: string) => ({ id: managerId })),
        },
        projectId,
        startDate,
        endDate,
      },
    })

    console.log(tasks)

    return NextResponse.json({ message: 'Success', tasks }, { status: 201 })
  } catch (err: any) {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    return NextResponse.json({ message: err + 'Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
