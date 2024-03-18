import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Container } from '@/components/Container'


const Page = async () => {
  const users = await prisma.user.findMany({
    include: {
      department: true,
    },
  });

  const deleteUser = async (data: FormData) => {
    'use server';
    const key = data.get('key') as string;
    await prisma.user.delete({
      where: { id: key }
    });
    revalidatePath('/');

  };

  return (
    <Container className="pb-16 pt-20 lg:pt-6">
      <ul role="list" className="divide-y divide-gray-100 dark:divide-gray-500">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200">{user.department.name}/{user.name}</p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.email}</p>
              </div>
            </div>
            <form>
              <input type="hidden" name="key" value={user.id} />
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                formAction={deleteUser}
              >
                削除
              </button>
            </form>

          </li>
        ))}
      </ul>
    </Container>
  );
};

export default Page;