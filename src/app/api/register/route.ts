import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'
import prismadb from '@/app/lib/prisma'

// ユーザー新規登録API
export const POST = async (req: Request, res: NextResponse) => {
  try {
    if (req.method !== 'POST')
      return NextResponse.json({ message: 'Bad Request' }, { status: 405 })

    const { name, username, email, password, departmentId, typeId, postId } = await req.json()

    const existingUser = await prismadb.user.findUnique({ where: { email } })

    if (existingUser)
      return NextResponse.json({ message: 'Email taken' }, { status: 422 })

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prismadb.user.create({
      data: {
        name,
        username,
        hashedPassword,
        image: '',
        departmentId,
        email,
        emailVerified: new Date(),
        typeId,
        postId,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}

