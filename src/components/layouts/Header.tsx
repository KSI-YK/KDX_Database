'use client'
import { LoginButton, LogoutButton } from '@/components/Buttons'
import { Fragment, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { NextAuthProvider } from '@/app/providers'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import { Container } from '@/components/Container'
import {
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  BriefcaseIcon,
  QueueListIcon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from '@heroicons/react/20/solid'
import kdxIcon from '@/images/kdx_icon.svg'
import Image from 'next/image'
import Link from 'next/link'

const projects = [
  {
    name: 'プロジェクト管理',
    description: 'プロジェクト・作番情報の追加、変更、進捗管理',
    href: '/project',
    icon: BriefcaseIcon,
  },
  {
    name: 'タスク管理',
    description: 'タスク・出張情報の追加、変更、進捗管理',
    href: '/project/task',
    icon: QueueListIcon,
  },
  {
    name: '報告書提出',
    description: '出張報告書の提出',
    href: '#',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: 'ユーザー登録',
    description: 'ユーザーの管理、追加',
    href: '/database/user',
    icon: UserCircleIcon,
  },
]

const database = [
  {
    name: 'クライアント',
    description: '客先情報の検索、追加、編集、削除',
    href: '/database/client',
    icon: BuildingOffice2Icon,
  },
  {
    name: 'システム',
    description: '設備情報の検索、追加、編集、削除',
    href: '/database/system',
    icon: BriefcaseIcon,
  },
  {
    name: 'デバイス',
    description: '装置情報の検索、追加、編集、削除',
    href: '/database/device',
    icon: QueueListIcon,
  },
  // { name: 'プロジェクト', description: 'プロジェクトの一覧', href: '#', icon: ClipboardDocumentCheckIcon },
  // { name: 'タスク', description: 'タスクの一覧', href: '/database/user', icon: UserCircleIcon },
  // { name: '報告書', description: '報告書の一覧', href: '/database/user', icon: UserCircleIcon },
  // { name: 'ユーザー', description: 'ユーザーの一覧', href: '/database/user', icon: UserCircleIcon },
]

const userList = [
  {
    name: 'プロジェクト管理',
    description: 'プロジェクト・作番情報の追加、変更、進捗管理',
    href: '/project',
    icon: BriefcaseIcon,
  },
  {
    name: 'タスク管理',
    description: 'タスク・出張情報の追加、変更、進捗管理',
    href: '/system',
    icon: QueueListIcon,
  },
  {
    name: '報告書提出',
    description: '出張報告書の提出',
    href: '#',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: 'ユーザー登録',
    description: 'ユーザーの管理、追加',
    href: '/database/user',
    icon: UserCircleIcon,
  },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

// 指定取得処理
const getDepartmentById = async (departmentId: string | undefined) => {
  // api
  const res = await fetch(
    `http://localhost:3000/api/departments/${departmentId}`,
  )
  const data = await res.json()
  return data.department
}

export default function Header() {
  return (
    <NextAuthProvider>
      <ClientHome />
    </NextAuthProvider>
  )
}

function ClientHome() {
  const { data: session } = useSession()
  const user = session?.user
  const departmentId = user?.departmentId
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [departmentName, setDepartmentName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (user?.departmentId) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/departments/${user.departmentId}`,
          )
          const data = await response.json()
          console.log(data)

          // APIから期待通りのレスポンスが返されたか確認
          if (data && data.department.name) {
            setDepartmentName(data.department.name)
          } else {
            // データが期待通りでない場合の処理
            console.log('部署名が取得できませんでした。', data)
            setDepartmentName('未設定') // 適切なデフォルト値を設定
          }
        } catch (error) {
          // API呼び出し中にエラーが発生した場合の処理
          console.error('部署情報の取得に失敗しました。', error)
          setDepartmentName('取得失敗') // エラー時のデフォルト値
        }
      }
    }
    fetchData()
  }, [user?.departmentId]) // 依存配列内でuser.departmentIdを監視

  return (
    <header className="bg-slate-100 dark:bg-slate-950 shadow-lg">
      <Container>
        <nav
          className="mx-auto flex items-center justify-between px-0 py-6"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" aria-label="Home">
              <Image
                className="h-8 w-auto"
                src={kdxIcon}
                alt="icon"
                unoptimized
              />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            <Popover className="relative">
              <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200 hover:dark:bg-slate-800 hover:dark:text-slate-50">
                Project
                <ChevronDownIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-slate-700">
                  <div className="p-4">
                    {projects.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 hover:dark:bg-slate-600"
                      >
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-slate-800 group-hover:dark:bg-slate-800">
                          <item.icon
                            className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-300"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-auto">
                          <a
                            href={item.href}
                            className="block font-semibold text-gray-900 dark:text-slate-200"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-100">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>

            <Popover className="relative">
              <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200 hover:dark:bg-slate-800 hover:dark:text-slate-50">
                Database
                <ChevronDownIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </Popover.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-slate-700">
                  <div className="p-4">
                    {database.map((item) => (
                      <div
                        key={item.name}
                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 hover:dark:bg-slate-600"
                      >
                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-slate-800 group-hover:dark:bg-slate-800">
                          <item.icon
                            className="h-6 w-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-300"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="flex-auto">
                          <a
                            href={item.href}
                            className="block font-semibold text-gray-900 dark:text-slate-200"
                          >
                            {item.name}
                            <span className="absolute inset-0" />
                          </a>
                          <p className="mt-1 text-gray-600 dark:text-gray-200">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>

            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-slate-200 hover:dark:bg-slate-800 hover:dark:text-slate-50"
            >
              Features
            </a>
          </Popover.Group>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <div>
              {user ? (
                <div>
                  <a href="/account" className="group block flex-shrink-0">
                    <div className="flex items-center">
                      <div>
                        {user.image ? (
                          <img
                            className="inline-block h-9 w-9 rounded-full"
                            src={user.image}
                            alt=""
                          />
                        ) : (
                          <UserCircleIcon
                            className="inline-block h-9 w-9 rounded-full text-gray-400"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 dark:text-slate-200 group-hover:dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 group-hover:dark:text-slate-200">
                          {departmentName}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="flex items-center">
              {user ? (
                <div>
                  <LogoutButton />
                </div>
              ) : (
                <div>
                  <LoginButton />
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* モバイルメニュー */}
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-slate-200 ">
                          Project
                          <ChevronDownIcon
                            className={classNames(
                              open ? 'rotate-180' : '',
                              'h-5 w-5 flex-none',
                            )}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        {/* <Disclosure.Panel className="mt-2 space-y-2">
                          {[...projects, ...callsToAction].map((item) => (
                            <Disclosure.Button
                              key={item.name}
                              as="a"
                              href={item.href}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 dark:text-slate-200 hover:bg-gray-50"
                            >
                              {item.name}
                            </Disclosure.Button>
                          ))}
                        </Disclosure.Panel> */}
                      </>
                    )}
                  </Disclosure>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-slate-200"
                  >
                    Features
                  </a>
                </div>
                <div className="py-6">
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-slate-200"
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Container>
    </header>
  )
}
