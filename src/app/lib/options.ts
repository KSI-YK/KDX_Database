// 認証用にPrisma Adapterをインポート
import { PrismaAdapter } from '@next-auth/prisma-adapter'
// パスワードをセキュアに管理するプラグイン
import bcrypt from 'bcrypt'
// NEXT-AUTHで認証
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// データベースのマイグレーションを取得（Userテーブルの情報取得用）
import prismadb from '@/app/lib/prisma'

export const options: NextAuthOptions = {
    // 認証の設定
    providers: [
        CredentialsProvider({

            name: "Sign in",
            credentials: {
                username: {
                    label: "Username",
                    type: "username",
                    placeholder: "hayato_shimada",
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            // ユーザー認証処理
            async authorize(credentials) {

                // emailとパスワードの入力チェック
                if (!credentials?.username || !credentials.password) {
                    throw new Error('ユーザーネームとパスワードを入力してください')
                }

                // ユーザーテーブルからユーザー情報を取得
                const user = await prismadb.user.findUnique({
                    where: { username: credentials.username },
                })

                if (!user || !user.hashedPassword) {
                    throw new Error('ユーザーネームが間違っています')
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword,
                )

                if (!isCorrectPassword) {
                    throw new Error('パスワードが間違っています')
                }
                return user
            },
        }),
    ],

    // サインインページの指定
    pages: {
        signIn: '/login',
    },
    debug: process.env.NODE_ENV === 'development',
    adapter: PrismaAdapter(prismadb),
    session: {
        strategy: 'jwt',
    },

    // jwtの設定
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,

    // コールバックの設定
    callbacks: {
        jwt: async ({token, user, account, profile}) => {

            if (user) {
                token.user = user;
                const u = user as any
                token.typeId = u.typeId
                token.postId = u.postId
                token.departmentId = u.departmentId
            }
            if (account) {
                token.accessToken = account.access_token
            }
            return token;
        },

        // サインインまたはサインアウト時にurlを遷移
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },

        session: ({ session, token }) => {
            token.accessToken
            return {
                ...session,
                user: {
                    ...session.user,
                    typeId: token.typeId,
                    postId: token.postId,
                    departmentId: token.departmentId,
                },
            }
        },
    },
}

