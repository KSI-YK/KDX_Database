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
  const projectId = params.id
  const user = await prisma.user.findMany()
  const status = await prisma.status.findMany()
  const taskTypes = await prisma.taskTypes.findMany()
  const project = await prisma.projects.findFirst({
    include: {
      director: true,
      status: true,
      type: true,
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
    where: { id: projectId },
  })

  return (
    <>
      <Header />
      <main className="pt-14">
        <Task.Create
          user={user}
          project={project}
          status={status}
          taskTypes={taskTypes}
        />
      </main>
      <Footer />
    </>
  )
}
