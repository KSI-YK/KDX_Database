import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Container } from '@/components/Container'
import { Clients, Systems, User } from '@prisma/client';

// System モデルに関連付けられた Client モデルのデータを含む
type SystemWithClient = Systems & {
  client: Clients;
} & {
  director: User;
};

async function fetchAllSystems() {
  // api
  const res = await fetch(`http://localhost:3000/api/systems`, {
    cache: "no-store", //ssr
  });
  const data = await res.json();
  console.log(data.systems);
  return data.systems;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const Page = async () => {
  const systems = await fetchAllSystems();

  return (
    <Container className="pb-16 pt-20 lg:pt-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Clients</h1>
          <p className="mt-2 text-sm text-gray-700">
            登録されているシステム一覧。
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-0 border-b border-gray-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Client
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 border-b border-gray-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 border-b border-gray-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Director
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 border-b border-gray-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Update
                  </th>

                  <th
                    scope="col"
                    className="sticky top-0 border-b border-gray-300 py-3.5 pl-3 pr-4  sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only"></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {systems.map((system: SystemWithClient, personIdx: any) => (
                  <tr key={system.name}>
                    {/* 顧客名の表示 */}
                    <td
                      className={classNames(
                        personIdx !== systems.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}
                    >
                      {system.client.name}
                    </td>

                    {/* 名前の表示 */}
                    <td
                      className={classNames(
                        personIdx !== systems.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}
                    >
                      {system.name}
                    </td>

                    {/* 責任者の表示 */}
                    <td
                      className={classNames(
                        personIdx !== systems.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}
                    >
                      {system.director.name}
                    </td>

                    {/* 日付の配置 */}
                    <td
                      className={classNames(
                        personIdx !== systems.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}
                    >
                      {new Date(system.updatedAt).toDateString()}
                    </td>
                    {/* ボタンの配置 */}
                    <td
                      className={classNames(
                        personIdx !== systems.length - 1 ? 'border-b border-gray-200' : '',
                        'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                      )}
                    >
    
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Page;