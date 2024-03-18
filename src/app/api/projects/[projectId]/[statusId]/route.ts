// /Users/hayatoshimada/Desktop/salient-ts/src/app/api/projects/[projectId]/route.ts

import prisma from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
import { main } from '../../route'

type Params = {
  projectId: string
  statusId: string
}

export async function PUT(request: Request, context: { params: Params }) {
  try {
    const projectId = context.params.projectId
    const statusId = context.params.statusId

    await main()
    const projects = await prisma.projects.update({
      data: { statusId },
      where: {
        id: projectId,
      },
    })

    return NextResponse.json({ message: 'Success', projects }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
