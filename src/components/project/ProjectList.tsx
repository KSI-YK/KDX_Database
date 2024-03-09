import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Container } from '@/components/Container'
import { Projects, ProjectTypes, User, Status, Clients, Devices, Systems } from '@prisma/client';

// projects モデルに関連付けられた devices, systems, clients モデルのデータを含む
type ProjectWithRelation = Projects & {
    client: Clients; 
    projectType: ProjectTypes;
    status: Status;
    director: User;
    device: Devices & {
        system: Systems & {
            client: Clients;
        };
    };
};


async function fetchAllProjects() {
    // api
    const res = await fetch(`http://localhost:3000/api/projects`, {
        cache: "no-store", //ssr
    });

    const data = await res.json();
    console.log(data.projects);
    return data.projects;

}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const Page = async () => {
  const projects = await fetchAllProjects();

  const deleteClient = async (data: FormData) => {
    'use server';
    const key = data.get('key') as string;
    await prisma.clients.delete({
      where: { id: key }
    });
    revalidatePath('/');
  };

  const updateClient = async (data: FormData) => {
    'use server';
    const key = data.get('key') as string;
    const clientName = data.get('updateName') as string;
    await prisma.clients.update({
      where: {
        id: key
      },
      data: {
        name: clientName
      }
    });
    revalidatePath('/');
  };

  return (
    <Container className="pb-16 pt-20 lg:pt-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Projects</h1>
            <p className="mt-2 text-sm text-gray-700">
              登録されているプロジェクト一覧。
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
                      className="sticky top-0 border-b border-gray-300 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                    >
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project: ProjectWithRelation, personIdx: any) => (
                    <tr key={project.id}>
                      {/* 顧客名の表示 */}
                      <td
                        className={classNames(
                          personIdx !== projects.length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                        )}
                      >
                        {project.device.system.client.name}
                      </td>

                      {/* 名前の表示 */}
                      <td
                        className={classNames(
                          personIdx !== projects.length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                        )}
                      >
                        {project.name}
                      </td>

                      {/* 責任者の表示 */}
                      <td
                        className={classNames(
                          personIdx !== projects.length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                        )}
                      >
                        {project.director.name}
                      </td>

                      {/* 日付の配置 */}
                      <td
                        className={classNames(
                          personIdx !== projects.length - 1 ? 'border-b border-gray-200' : '',
                          'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                        )}
                      >
                        {new Date(project.updatedAt).toDateString()}
                      </td>

                      {/* ボタンの配置 */}
                      <td
                        className={classNames(
                          personIdx !== projects.length - 1 ? 'border-b border-gray-200' : '',
                          'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                        )}
                      >
                        <form>
                          <input type="hidden" name="key" value={project.id} />
                          <input type="hidden" name="name" value={project.name} />
                          <input
                            type="text"
                            id="updateName"
                            autoComplete="username"
                            className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder={project.name}
                            name="updateName" 
                          />
                          <button
                            type="submit"
                            className="rounded-md bg-indigo-600 mx-2 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            formAction={updateClient}
                          >
                            Update
                          </button>
                          <button
                            type="submit"
                            className="rounded-md bg-indigo-600 mx-2 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            formAction={deleteClient}
                          >
                            Delete
                          </button>
                        </form>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Page;