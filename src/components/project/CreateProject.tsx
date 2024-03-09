import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Container } from '@/components/Container'
import SearchSystem from '@/components/project/CreateProject';


const Page = async () => {

    // 部署名・ユーザータイプ・役職等の選択入力用にデータベースから取得
    const user = await prisma.user.findMany();
    const clients = await prisma.clients.findMany();
    const systems = await prisma.systems.findMany();
    const devices = await prisma.devices.findMany();
    const projectTypes = await prisma.projectTypes.findMany();
    const status = await prisma.status.findMany();


    

    // // ユーザー登録ボタンを押した際の処理
    // const addUser = async (data: FormData) => {
    //     'use server';
    //     // 従業員名称チェック
    //     const name: string = data.get('employeeName') as string;

    //     // ユーザーネーム重複チェック
    //     const username: string = data.get('username') as string;
    //     const existingUser = await prisma.user.findUnique({ where: { username } })
    //     if (existingUser)
    //         return NextResponse.json({ message: 'ユーザーネームが重複しています' }, { status: 422 })

    //     // メールアドレス重複チェック
    //     const email: string = data.get('email') as string;
    //     const existingEmail = await prisma.user.findUnique({ where: { email } })
    //     if (existingEmail)
    //         return NextResponse.json({ message: 'メールアドレスが重複しています' }, { status: 422 })

    //     // パスワードをセキュアに管理
    //     const password: string = data.get('password') as string;
    //     const hashedPassword = await bcrypt.hash(password, 12)

    //     // リレーション用ID関連
    //     const departmentId: string = data.get('department') as string;  // 部署
    //     const typeId: string = data.get('type') as string;              // ユーザータイプ
    //     const postId: string = data.get('post') as string;              // 役職

    //     // console.log(departmentId);

    //     // prismaのクリエイトを使って、userテーブルにデータを追加
    //     await prisma.user.create({ data: { name, username, email, hashedPassword, departmentId, typeId, postId } });

    //     // ページをリフレッシュ
    //     revalidatePath('/');

    // };

    //html生成
    return (
        <Container className="pb-2 pt-20 lg:pt-6">

            <form>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-4 pt-4">
                        <h2 className="text-lg font-semibold leading-12 text-gray-900">プロジェクト登録</h2>
                    </div>

                    <div className="pb-12 pt-4">

                        {/* 客先選択グリッド */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 pt-4">
                            <div>
                                <h3 className="text-base font-semibold leading-12 text-gray-900">客先情報</h3>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    プロジェクトを作成する客先・システム・装置を選んでください。
                                </p>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    例：カネソウ→KDM-4-AR→砂処理設備
                                </p>
                            </div>


                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                {/* クライアント */}
                                <SearchSystem />

                                {/* システム */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                        システム/System
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="client"
                                            name="client"
                                            autoComplete="country-name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="">--システム選択</option>
                                            {/* {systems.map((system) => (
                                                <option key={system.id} value={system.id}>{system.name}</option>
                                            ))} */}

                                        </select>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                        装置検索
                                    </label>
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            className="rounded-md bg-indigo-600 px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            // onClick={searchDevices}
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>

                                {/* 装置 */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                        装置/Device
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="client"
                                            name="client"
                                            autoComplete="country-name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="">--装置選択</option>
                                            {clients.map((client) => (
                                                <option key={client.id} value={client.id}>{client.name}</option>
                                            ))}

                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* 基本情報グリッド */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                            <div>
                                <h3 className="text-base font-semibold leading-12 text-gray-900">基本情報</h3>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    プロジェクトに関する情報を入力してください。
                                </p>
                            </div>

                            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                                {/* プロジェクト名 */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                        プロジェクト名
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="director"
                                            id="director"
                                            autoComplete="username"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="錘載せ替え工事"
                                        />
                                    </div>
                                </div>

                                {/* 責任者 */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                        責任者/Director
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="director"
                                            name="director"
                                            autoComplete="country-name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="">--責任者を選択してください</option>
                                            {user.map((user) => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}

                                        </select>
                                    </div>
                                </div>

                                {/* 状態 */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                        状態/Status
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="department"
                                            name="department"
                                            autoComplete="country-name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="">--状態を選択してください</option>
                                            {status.map((status) => (
                                                <option key={status.id} value={status.id}>{status.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 種別 */}
                                <div className="sm:col-span-4">
                                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                        種別/Types
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="post"
                                            name="post"
                                            autoComplete="country-name"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option value="">--種別を選択してください</option>
                                            {projectTypes.map((type) => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
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
                        // formAction={addUser}

                    >
                        ユーザー登録
                    </button>
                </div>
            </form>
        </Container>
    )
}
export default Page;


