import { TaskWith } from '@/types'

// Taskの編集
export const editTask = async (
  name: string | undefined,
  typeId: string | undefined,
  statusId: string | undefined,
  creatorId: string | undefined,
  directorId: string | undefined,
  managers: (string | undefined)[],
  startDate: any,
  endDate: any,
  id: any,
) => {
  const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      typeId,
      statusId,
      creatorId,
      directorId,
      managers,
      startDate,
      endDate,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}

export const fetchTaskWithProject = async (
  projectId: string,
  setData: React.Dispatch<React.SetStateAction<TaskWith[]>>
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/tasks/projectwith/${projectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (response.ok) {
      const fetchedData = await response.json()
      setData(fetchedData.tasks) // ここでsetDataを使用
    } else {
      console.error('Failed to fetch tasks')
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}

// TaskのStatusを更新
export const updateTaskStatus = async (
  taskId: string,
  statusId: string,
  projectId: string,
  setTask: React.Dispatch<React.SetStateAction<TaskWith[]>>,
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/tasks/statusupdate/${taskId}/${statusId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (response.ok) {
      // ステータス更新が成功したらデータを再取得
      await fetchTaskWithProject(projectId, setTask)
    } else {
      console.error('Failed to update status')
    }
  } catch (error) {
    console.error('Error updating status:', error)
  }
}

// Project追加
export const addProject = async (
  name: string | undefined,
  typeId: string | undefined,
  statusId: string | undefined,
  deviceId: string | undefined,
  directorId: string | undefined,
  managers: (string | undefined)[],
  startDate: any,
  endDate: any,
) => {
  const res = await fetch(`http://localhost:3000/api/projects`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      typeId,
      statusId,
      deviceId,
      directorId,
      managers,
      startDate,
      endDate,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}