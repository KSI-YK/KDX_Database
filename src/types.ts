import {
  Clients,
  Departments,
  Devices,
  ProjectTypes,
  Projects,
  Status,
  Systems,
  TaskTypes,
  Tasks,
  User,
} from '@prisma/client'
import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      departmentId: string
    } & DefaultSession['user']
  }
}

export type TaskWith = Tasks & {
  type: TaskTypes
  director: User & {
    department: Departments
  }
  creator: User & {
    department: Departments
  }
  status: Status
  managers: User[] & {
    department: Departments
  }
} & {
  project: Projects & {
    device: Devices & {
      system: Systems & {
        client: Clients
      }
    }
  }
}

export type ProjectWith = Projects & {
  status: Status,
  type: ProjectTypes
  device: Devices & {
    system: Systems & {
      client: Clients
    }
  }
  director: User & {
    department: Departments
  }
}
