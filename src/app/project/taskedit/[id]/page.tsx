import Header from '@/components/layouts/Header'
import { Footer } from '@/components/layouts/Footer'
import * as Task from '@/components/task/index'
import prisma from '@/lib/prisma'

// Main
export default async function ClientPage({
  params,
}: {
  params: { id: string }
}) {
  const id = params.id
  console.log(id)
  const user = await prisma.user.findMany()
  const status = await prisma.status.findMany()
  const taskTypes = await prisma.taskTypes.findMany()

  const task = await prisma.tasks.findFirst({
    include: {
      director: true,
      creator: true,
      status: true,
      type: true,
      project: {
        include: {
          device: {
            include: {
              system: {
                include: {
                  client: true,
                },
              },
            },
          },
        },
      },
    },
    where: { id: id },
  })

  console.log(task)

  return (
    <>
      <Header />
      <main className="pt-14">
        <Task.Edit 
          user={user}
          status={status}
          taskTypes={taskTypes}
        />

      </main>
      <Footer />
    </>
  )
}
