'use client';
import { NextPage } from "next";
import { HomeIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import { useRouter } from 'next/router'

export const BreadCrumb: NextPage = () => {

  const router = useRouter();
  const paths = decodeURI(router.asPath).substring(1).split("/");
  // リンク先アドレスの取得
  const roots = [""];
  for (let i = 0; i < paths.length; i++) roots.push(roots[i] + "/" + paths[i]);

  return (
    <nav className="flex border-b border-gray-200 bg-white" aria-label="Breadcrumb">
      <ol role="list" className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
        <li className="flex">
          <div className="flex items-center">
            <Link href={"/"}>
              <a className="text-gray-400 hover:text-gray-500">
                <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </a>
            </Link>
          </div>
        </li>
        {paths.map((page, index) => (
          <li key={index} className="flex">
            <div className="flex items-center">
              <svg
                className="h-full w-6 flex-shrink-0 text-gray-200"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <Link href={roots[index + 1]} key={index}>
                <a
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {page}
                </a>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

