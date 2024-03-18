import prisma from '@/app/lib/prisma'
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
    const clientId: string = req.url.split('/systems/searchClientId/')[1]
    console.log(clientId)
    await main()
    const systems = await prisma.systems.findMany({
      include: {
        director: true,
        client: true,
      },
      where: {
        clientId: clientId as string,
      },
    })

    console.log()

    return NextResponse.json({ message: 'Success', systems }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
