import prisma from '../../lib/prisma';

const Page = async () => {
  const users = await prisma.user.findMany();

  return (
    <div className="m-8">
      <h1 className="text-xl font-bold">ユーザー一覧</h1>
      <ul className="mt-8">
        {users.map((user) => (
          <div>
            <li key={user.id}>{user.name}</li>
            <li key={user.id}>{user.email}</li>
          </div>
          
        ))}
      </ul>
    </div>
  );
};

export default Page;