'use client'

import React, { useEffect, useState } from 'react'
import {
  Clients,
  Devices,
  Projects,
  Status,
  Systems,
  Tasks,
  User,
} from '@prisma/client'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { Menu, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/20/solid'

// System モデルに関連付けられた Client モデルのデータを含む
type ProjectWith = Tasks & {
  project: Projects & {
    device: Devices & {
      system: Systems & {
        client: Clients
      }
    }
  }
} & {
  director: User
} & {
  creator: User
} & {
  status: Status
}

interface SearchResultsListProps {
  searchTasks: ProjectWith[]
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  searchTasks,
}) => {
  const [status, setStatus] = useState<ProjectWith[]>([])

  const updateProjectStatus = async (projectId: string, statusId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/projects/${projectId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ statusId }),
        },
      )
      if (response.ok) {
        // ステータスの更新に成功した場合、状態を更新します
        const updatedProject = await response.json()
        // 状態を更新するロジックをここに実装します
        // 例えば、searchResultsを更新するなど
      } else {
        // エラーハンドリング
        console.error('Status update failed')
      }
    } catch (error) {
      console.error('Error updating project status:', error)
    }
  }

  // useEffectフックを使用して、コンポーネントがマウントされた時に実行される処理を定義します
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/status')
        const data = await response.json()
        // 取得したデータでsystemsステートを更新します
        setStatus(data.status)
      } catch (error) {
        console.error('システムの取得に失敗しました:', error)
      }
    }

    fetchSystems()
  }, []) // 依存配列を空にすることで、コンポーネントがマウントされた時にのみ実行されます
  return (
    <Container className="pb-2 pt-20 lg:pt-6">
      {/* 新規追加ボタン */}
      <div className="my-4 flex flex-row-reverse">
        <div>
          <Button href="/database/device/add" className="sticky top-1">
            新規追加
          </Button>
        </div>
      </div>

      {Array.isArray(searchTasks) &&
        searchTasks.map((task) => (
          <div className="border-b border-gray-200 bg-white px-4 py-5 dark:border-gray-500 dark:bg-slate-900 sm:px-6">
            <div className="flex min-w-0 flex-auto items-center justify-between py-2">
              <div>
                <p className="text-sm leading-6 text-gray-900 dark:text-slate-200">
                  {task.name}
                </p>
              </div>

              <div className="">
                {/* 完了済みセレクタ */}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200">
                      {task.status.name}
                      <ChevronDownIcon
                        className="-mr-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Menu.Items
                    className="absolute z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800"
                  >
                    <div className="py-1">
                      {status.map((feature) => (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="submit"
                              key={feature.id}
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-slate-100'
                                  : 'text-gray-700 dark:text-slate-200',
                                'block w-full px-4 py-2 text-left text-sm',
                              )}
                              onClick={() =>
                                updateProjectStatus(task.id, feature.id)
                              } // ここでプロジェクトIDとステータスIDを渡します
                            >
                              {feature.name}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
            <div className="-ml-4 -mt-4 flex items-center justify-between">
              <div className="ml-4 mt-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200">
                      Director:{task.director.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {task.director.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="ml-4 mt-4 flex flex-shrink-0">
                <button
                  type="button"
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <PhoneIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Phone</span>
                </button>
                <button
                  type="button"
                  className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <EnvelopeIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Email</span>
                </button>
              </div>
            </div>
          </div>
        ))}
    </Container>
  )
}

export default SearchResultsList
