// /Users/hayatoshimada/Desktop/salient-ts/src/app/api/tasks/statusupdate/[taskId]/[statusId]/route.ts

import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { main } from '../../../route'

type Params = {
  taskId: string
  statusId: string
}

export async function PUT(request: Request, context: { params: Params }) {
  try {
    const taskId = context.params.taskId
    const statusId = context.params.statusId
    console.log(context)

    await main()
    const projects = await prisma.tasks.update({
      data: { statusId },
      where: {
        id: taskId,
      },
    })

    return NextResponse.json({ message: 'Success', projects }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
