import bcrypt from 'bcrypt';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Container } from '@/components/Container'
import { getServerSession } from 'next-auth';
import { options } from '@/lib/options';


const Page = async () => {

    // セッションからログイン情報を取得
    const session = await getServerSession(options)


    // 部署名・ユーザータイプ・役職等の選択入力用にデータベースから取得
    const departments = await prisma.departments.findMany();
    const userTypes = await prisma.userTypes.findMany();
    const userPosts = await prisma.userPosts.findMany();

    // ユーザー登録ボタンを押した際の処理
    const addUser = async (data: FormData) => {
        'use server';

        // 従業員名称チェック
        const name: string = data.get('employeeName') as string;

        // ユーザーネーム重複チェック
        const username: string = data.get('username') as string;
        const existingUser = await prisma.user.findUnique({ where: { username } })
        if (existingUser)
            return NextResponse.json({ message: 'ユーザーネームが重複しています' }, { status: 422 })

        // メールアドレス重複チェック
        const email: string = data.get('email') as string;
        const existingEmail = await prisma.user.findUnique({ where: { email } })
        if (existingEmail)
            return NextResponse.json({ message: 'メールアドレスが重複しています' }, { status: 422 })

        // パスワードをセキュアに管理
        const password: string = data.get('password') as string;
        const hashedPassword = await bcrypt.hash(password, 12)

        // リレーション用ID関連
        const departmentId: string = data.get('department') as string;  // 部署
        const typeId: string = data.get('type') as string;              // ユーザータイプ
        const postId: string = data.get('post') as string;              // 役職

        // prismaのクリエイトを使って、userテーブルにデータを追加
        await prisma.user.create({ data: { name, username, email, hashedPassword, departmentId, typeId, postId } });

        // ページをリフレッシュ
        revalidatePath('/');

    };

    //html生成
    return (
        <Container className="pb-2 pt-20 lg:pt-6">

            <form>
                <div className="space-y-12">
                    <div className="border-b border-gray-300 dark:border-gray-500 pb-4 pt-4">
                        <h2 className="text-lg font-semibold leading-12 text-gray-900 dark:text-slate-200">ユーザー登録</h2>
                    </div>

                    <div className="pb-12 pt-4">


                        {/* 基本情報グリッド */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-300 dark:border-gray-500 pb-12 md:grid-cols-3">
                            <div>
                                <h3 className="text-base font-semibold leading-12 text-gray-900 dark:text-slate-200">基本情報</h3>
                                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-100">
                                    従業員情報を入力してください。
                                </p>
                            </div>

                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                {/* 従業員名 */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                        従業員名
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="employeeName"
                                            id="employeeName"
                                            autoComplete="username"
                                            className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="島田迅人"
                                        />
                                    </div>
                                </div>

                                {/* メールアドレス */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                        メールアドレス
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="hayato_shimada@kanamori-system.co.jp"
                                        />
                                    </div>
                                </div>

                                {/* 部署 */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                        部署/Departments
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="department"
                                            name="department"
                                            autoComplete="country-name"
                                            className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="">--部署を選択してください</option>
                                            {departments.map((department) => (
                                                <option key={department.id} value={department.id}>{department.name}</option>
                                            ))}

                                        </select>
                                    </div>
                                </div>

                                {/* 役職 */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                        役職/Posts
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="post"
                                            name="post"
                                            autoComplete="country-name"
                                            className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="">--役職を選択してください</option>
                                            {userPosts.map((post) => (
                                                <option key={post.id} value={post.id}>{post.name}</option>
                                            ))}

                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* サインイン情報グリッド */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-300 dark:border-gray-500 pb-12 md:grid-cols-3 pt-4">
                            <div>
                                <h3 className="text-base font-semibold leading-12 text-gray-900 dark:text-slate-200">サインイン情報</h3>
                                <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-100">
                                    サインイン用の情報を入力してください。パスワードを覚えておいてください。
                                </p>
                            </div>

                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                <div className="sm:col-span-4">
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                        ユーザー名
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            autoComplete="username"
                                            className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="hayato_shimada_elk"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                        パスワード
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            autoComplete="username"
                                            className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="**Kanamori01"
                                        />
                                    </div>
                                </div>



                                <div className="sm:col-span-4">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                        種別
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="type"
                                            name="type"
                                            autoComplete="country-name"
                                            className="block w-full rounded-md border-0 py-1.5 dark:bg-slate-800 text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="">--データ管理者以外は一般</option>
                                            {userTypes.map((type) => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}

                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                        イメージ画像
                                    </label>
                                    <div className="mt-2 flex items-center gap-x-3">
                                        <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                        <button
                                            type="button"
                                            className="rounded-md bg-white dark:bg-slate-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-200">
                                        イメージ画像アップロード
                                    </label>
                                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-500 px-6 py-10">
                                        <div className="text-center">
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-100">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md bg-white dark:bg-slate-800 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                >
                                                    <span className=''>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only dark:bg-slate-800" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600 dark:text-gray-100">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    {/* <button 
                    type="button" 
                    className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button> */}
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        formAction={addUser}

                    >
                        ユーザー登録
                    </button>
                </div>
            </form>
        </Container>
    )
}
export default Page;

