'use client'
import React, { useRef, useState } from 'react'
import { Container } from '@/components/Container'
import {
  Clients,
  Devices,
  ProjectTypes,
  Projects,
  Status,
  Systems,
  TaskTypes,
  User,
} from '@prisma/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Select, { ActionMeta, MultiValue } from 'react-select'
import { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from '@/components/DatePickerWithRange'
import { utcToZonedTime, format } from 'date-fns-tz';

type ProjectWith = Projects & {
  director: User
} & {
  status: Status
} & {
  type: ProjectTypes
} & {
  device: Devices & {
    system: Systems & {
      client: Clients
    }
  }
}

interface CreatePageProps {
  user: User[]
  project: ProjectWith | null
  status: Status[]
  taskTypes: TaskTypes[]
}

interface Option {
  value: string | undefined
  label: string | undefined
}

// APIリクエスト送信 Task追加
const addTask = async (
  name: string | undefined,
  typeId: string | undefined,
  statusId: string | undefined,
  creatorId: string | undefined,
  directorId: string | undefined,
  managers: (string | undefined)[],
  projectId: string | undefined,
  startDate: any,
  endDate: any,
) => {
  const res = await fetch(`http://localhost:3000/api/tasks`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      typeId,
      statusId,
      creatorId,
      directorId,
      managers,
      projectId,
      startDate,
      endDate,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}

// Main
const Create: React.FC<CreatePageProps> = ({
  user, // ユーザー一覧
  project, // タスクを追加するproject
  status, // 状態一覧
  taskTypes, // タスク種別一覧
}) => {
  const router = useRouter()

  // -------フックスでの入力監視
  // タスク名
  const [inputName, setName] = useState('')
  // 種別
  const [selectedType, setType] = useState<Option | null>(null)
  // 状態
  const [selectedStatus, setStatus] = useState<Option | null>(null)
  // 依頼者
  const [selectedCreator, setCreator] = useState<Option | null>(null)
  // 責任者
  const [selectedDirector, setDirector] = useState<Option | null>(null)
  // 担当者（配列）
  const [selectedManagers, setManagers] = useState<Option[] | null>([])
  // タスクの開始日と終了日
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // DatePickerWithRangeから日付範囲の変更を受け取る
  const handleDateChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange)
  }

  // 開始日と終了日をDATETIME形式に変換する関数
  const formatDateTime = (date?: Date) => {
    if (!date) return '';

    // JSTのタイムゾーンID
    const timeZone = 'Asia/Tokyo';
  
    // UTC時刻をJST時刻に変換
    const jstDate = utcToZonedTime(date, timeZone);
  
    // JST時刻を指定のフォーマットで文字列化
    return format(jstDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone });
  }

  // 登録処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const startDate = formatDateTime(dateRange?.from)
    const endDate = formatDateTime(dateRange?.to)
    console.log(startDate)
    if (
      inputName &&
      selectedType &&
      selectedStatus &&
      selectedCreator &&
      selectedDirector &&
      selectedManagers &&
      project
    ) {
      const managerValues = selectedManagers
        ? selectedManagers.map((manager) => manager.value)
        : []
      await addTask(
        inputName,
        selectedType.value,
        selectedStatus.value,
        selectedCreator.value,
        selectedDirector.value,
        managerValues,
        project.id,
        startDate,
        endDate,
      )
      router.push('/project')
      router.refresh
    } else {
      alert('入力不足')
    }
  }

  // onChangeハンドラ
  const handleSelectChange = (
    newValue: MultiValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>,
  ) => {
    // MultiValueをOption[]型に変換
    const newManagers: Option[] = newValue.map((option) => ({
      value: option.value,
      label: option.label,
    }))

    // ステート更新
    setManagers(newManagers)
  }

  // Optionsを適切な形式に変換
  const userOptions = user.map((user) => ({ value: user.id, label: user.name }))
  const statusOptions = status.map((status) => ({
    value: status.id,
    label: status.name,
  }))
  const taskOptions = taskTypes.map((taskOp) => ({
    value: taskOp.id,
    label: taskOp.name,
  }))

  // 開始日と終了日をDATETIME形式に変換
  const startDate = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd'T'HH:mm:ss")
    : ''
  const endDate = dateRange?.to
    ? format(dateRange.to, "yyyy-MM-dd'T'HH:mm:ss")
    : ''

  return (
    <Container className="pb-2">
      <div className="space-y-4">
        {/* ページヘッダー */}
        <div className="sm:flex sm:items-center">
          <div className="border-b border-gray-300 dark:border-gray-500 sm:flex-auto">
            <h1 className="pt-4 text-3xl font-semibold text-gray-900 dark:text-slate-200">
              Create Task
            </h1>
            <p className="pb-2 text-xs text-gray-500">
              {project?.name}のタスク作成
            </p>
            <p className="pb-2 text-sm leading-4 text-gray-900 dark:text-slate-200">
              Client: {project?.device.system.client.name}　&gt;　System:{' '}
              {project?.device.system.name}　&gt;　Device:{' '}
              {project?.device.name}　&gt;　Project: {project?.name}
            </p>
          </div>
        </div>

        {/* タスク情報入力フォーム */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* タスク名 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">タスク名</Label>
              <Input
                type="text"
                id="name"
                placeholder="プログラム変更"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 種別入力 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="status">種別</Label>
              <Select
                id="status"
                name="status"
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                options={taskOptions}
                onChange={setType}
              />
              <Button type='button'>新規追加</Button>
            </div>

            {/* 状態入力 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="status">状態</Label>
              <Select
                id="status"
                name="status"
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                options={statusOptions}
                onChange={setStatus}
              />
            </div>

            {/* 依頼者選択 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="director">依頼者</Label>
              <Select
                id="director"
                name="director"
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                isSearchable={true}
                options={userOptions}
                onChange={setCreator}
              />
            </div>

            {/* 責任者選択 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="director">責任者</Label>
              <Select
                id="director"
                name="director"
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                isSearchable={true}
                options={userOptions}
                onChange={setDirector}
              />
            </div>

            {/* 担当者選択（複数選択可） */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="manager">担当者 ※複数選択可</Label>
              <Select
                id="manager"
                name="manager"
                isMulti
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                isSearchable={true}
                options={userOptions}
                onChange={handleSelectChange}
              />
            </div>

            {/* 開始→終了の期間選択 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>タスク期間</Label>
              <DatePickerWithRange
                className=""
                onDateChange={handleDateChange}
              />
              <div>
                <p className="text-xs text-gray-500">開始日: {startDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">終了日: {endDate}</p>
              </div>
            </div>
          </div>

          {/* 登録ボタン */}
          <div className="my-4 flex flex-row-reverse">
            <div>
              <Button type="submit">登録</Button>
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default Create
