import prisma from '@/app/lib/prisma';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { Button } from '@/components/Button';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const Page = async () => {
  const clients = await prisma.clients.findMany();
  return (
    <Container className="pb-16 pt-20 lg:pt-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Clients
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            登録されている取引先一覧。
          </p>
        </div>
      </div>

      {/* テーブル */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-1 border-b bg-white border-gray-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Name
                  </th>

                  <th
                    scope="col"
                    className="sticky top-1 border-b bg-white border-gray-300 py-3.5 pl-4 pr-3 text-right sm:pl-6 lg:pl-8"
                  >
                    <Button href="/database/client/add" className='sticky top-1'>
                      追加
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, personIdx) => (
                  <tr key={client.name}>
                    {/* 名前の表示 */}
                    <td
                      className={classNames(
                        personIdx !== clients.length - 1 ? 'border-b border-gray-200' : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}
                    >
                      {client.name}
                    </td>

                    {/* 編集リンクの配置 */}
                    <td
                      className={classNames(
                        personIdx !== clients.length - 1 ? 'border-b border-gray-200' : '',
                        'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                      )}
                    >
                      <Link
                        href={`/database/client/edit/${client.id}`}
                      >
                        編集
                      </Link>
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