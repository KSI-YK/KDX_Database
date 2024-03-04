import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

const Page = async () => {
    const users = await prisma.user.findMany();  

    const addUser = async (data: FormData) => {
        'use server';
        console.log(data);
        const name: string = data.get('name') as string;
        const email: string = data.get('email') as string;
        const departmentId1: string = data.get('departmentId') as string;
        const departmentId: number = Number(departmentId1);

        // prismaのクリエイトを使って、userテーブルにデータを追加
        await prisma.user.create({ data: { name, email, departmentId } });
        revalidatePath('/');

    };
  
    return (
        <form className="flex items-center mt-4">
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" className="border mx-2 p-1" />
            <input type="email" name="email" className="border mx-2 p-1" />
            <input type="number" name="departmentId" className="border mx-2 p-1" />
            <button
            type="submit"
            className="bg-blue-600 px-2 py-1 rounded-lg text-sm text-white"
            formAction={addUser}
            >
            ユーザー追加
            </button>
        </form>
    );
  };
  
  export default Page;