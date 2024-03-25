'use client'
import React, { useEffect, useState } from 'react'
import {
  Clients,
  Departments,
  Devices,
  Projects,
  Status,
  Systems,
  Tasks,
  User,
} from '@prisma/client'
import { Container } from '@/components/Container'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import { TaskList } from './TaskList'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { TaskWith } from '@/types'
import { ProjectWith } from '@/types'

interface SearchResultsListProps {
  searchProjects: ProjectWith[]
}

interface TaskList {
  task: TaskWith[]
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  searchProjects,
}) => {
  const router = useRouter()
  const [status, setStatus] = useState<ProjectWith[]>([])
  const [clickTasks, setTaskList] = useState<TaskList | null>(null)

  // projectの状態を更新した場合の処理
  const updateProjectStatus = async (projectId: string, statusId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/projects/${projectId}/${statusId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      )
      if (response.ok) {
        router.refresh()
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
      <div className="grid grid-cols-1 gap-6">
        <Accordion type="single" collapsible className="grid gap-4">
          {Array.isArray(searchProjects) &&
            searchProjects.map((project) => (
              <div
                key={project.id}
                className="group block bg-white shadow-md hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-950"
              >
                <div className="px-4 py-2 sm:px-6">
                  <div className="flex min-w-0 flex-auto items-center justify-between py-2">
                    <div>

                      {/* ページヘッダー */}
                      <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                          <h1 className="pb-1 text-xl font-semibold text-gray-900 dark:text-slate-200">
                            {project?.name}
                          </h1>
                          <p className="text-xs text-gray-500">
                            Client: {project?.device.system.client.name}
                            　&gt;　System: {project?.device.system.name}
                            　&gt;　Device: {project?.device.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
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
                            Director:{project.director.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {project.director.department.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="-ml-4 -mt-4 flex items-center justify-between">
                    <div className="ml-4 mt-4 flex items-center gap-2">
                      <div>
                        <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200">
                          Project Status
                        </p>
                      </div>
                      <div className="flex items-center">
                        {/* 完了済みセレクタ */}
                        <select
                          key={project.id}
                          id="department"
                          name="department"
                          autoComplete="country-name"
                          onChange={(e) =>
                            updateProjectStatus(project.id, e.target.value)
                          } // ここでプロジェクトIDと選択されたステータスIDを渡します
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-slate-200 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option>{project.status.name}</option>
                          {status.map((status) => (
                            <option key={status.id} value={status.id}>
                              {status.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="ml-4 mt-4 flex flex-shrink-0">
                      <button
                        type="button"
                        className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <PhoneIcon
                          className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Phone</span>
                      </button>
                      <button
                        type="button"
                        className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <EnvelopeIcon
                          className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>
                  <AccordionItem value={project.id}>
                    <AccordionTrigger>
                      <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200">
                        Taskを表示
                      </p>
                    </AccordionTrigger>
                    <AccordionContent>
                      <TaskList projectId={project.id} />
                    </AccordionContent>
                  </AccordionItem>
                </div>
              </div>
            ))}
        </Accordion>
      </div>
    </Container>
  )
}

export default SearchResultsList
