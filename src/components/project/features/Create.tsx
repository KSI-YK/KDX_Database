'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/Container'
import {
  Clients,
  Devices,
  ProjectTypes,
  Status,
  Systems,
  User,
} from '@prisma/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Select, { ActionMeta, MultiValue } from 'react-select'
import { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from '@/components/DatePickerWithRange'
import { utcToZonedTime, format } from 'date-fns-tz'
import { addProject } from '@/app/project/ApiReqProject'

interface Option {
  value: string | undefined
  label: string | undefined
}

interface CreatePageProps {
  clients: Clients[]
  initSystems: Systems[]
  initDevices: Devices[]
  user: User[]
  projectTypes: ProjectTypes[]
  status: Status[]
}

// Main
const Create: React.FC<CreatePageProps> = ({
  clients,
  initSystems,
  initDevices,
  user, // ユーザー一覧
  projectTypes, // タスク種別一覧
  status, // 状態一覧
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
  const [selectedClient, setClient] = useState<Option | null>(null)
  // システム
  const [selectedSystem, setSystem] = useState<Option | null>(null)
  // デバイス
  const [selectedDevice, setDevice] = useState<Option | null>(null)
  // 責任者
  const [selectedDirector, setDirector] = useState<Option | null>(null)
  // 担当者（配列）
  const [selectedManagers, setManagers] = useState<Option[] | null>([])
  // タスクの開始日と終了日
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // SystemとDeviceをフィルタリングする
  const [filteredSystems, setFilteredSystems] = useState<Option[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Option[]>([])

  // DatePickerWithRangeから日付範囲の変更を受け取る
  const handleDateChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange)
  }

  // Clientが変更されたら、Systemsの初期値をフィルタリング後にOption形式に変換する
  useEffect(() => {
    // クライアントに対して、Systemが登録されていない場合のエラー処理を後から追加したい
    if (initSystems && selectedClient) {
      const filtered = initSystems.filter(
        (system) => system.clientId === selectedClient.value,
      )
      const systemOptions = filtered.map((system) => ({
        value: system.id,
        label: system.name,
      }))
      setFilteredSystems(systemOptions)
    }
  }, [selectedClient]) // Clientが選択された時に実行

  // Systemが変更されたら、Devicesの初期値をフィルタリング後にOption形式に変換する
  useEffect(() => {
    // クライアントに対して、Systemが登録されていない場合のエラー処理を後から追加したい
    if (initDevices && selectedSystem) {
      const filtered = initDevices.filter(
        (device) => device.systemId === selectedSystem.value,
      )
      const deviceOptions = filtered.map((device) => ({
        value: device.id,
        label: device.name,
      }))
      setFilteredDevices(deviceOptions)
    }
  }, [selectedSystem]) // Clientが選択された時に実行

  // 開始日と終了日をDATETIME形式に変換する関数
  const formatDateTime = (date?: Date) => {
    if (!date) return ''
    // JSTのタイムゾーンID
    const timeZone = 'Asia/Tokyo'

    // UTC時刻をJST時刻に変換
    const jstDate = utcToZonedTime(date, timeZone)

    // JST時刻を指定のフォーマットで文字列化
    return format(jstDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone })
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
      selectedDevice &&
      selectedDirector &&
      selectedManagers
    ) {
      const managerValues = selectedManagers
        ? selectedManagers.map((manager) => manager.value)
        : []
      await addProject(
        inputName,
        selectedType.value,
        selectedStatus.value,
        selectedDevice.value,
        selectedDirector.value,
        managerValues,
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
  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }))
  const statusOptions = status.map((status) => ({
    value: status.id,
    label: status.name,
  }))
  const projectOptions = projectTypes.map((projectOp) => ({
    value: projectOp.id,
    label: projectOp.name,
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
              Create Project
            </h1>
            <p className="pb-2 text-xs text-gray-500">プロジェクトの作成</p>
          </div>
        </div>

        {/* タスク情報入力フォーム */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* 種別入力 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="status">客先</Label>
              <Select
                id="client"
                name="client"
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                options={clientOptions}
                onChange={setClient}
              />
            </div>

            {/* 設備入力 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="status">設備</Label>
              <Select
                id="system"
                name="system"
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                options={filteredSystems}
                onChange={setSystem}
              />
            </div>

            {/* 装置入力 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="status">装置</Label>
              <Select
                id="device"
                name="device"
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                options={filteredDevices}
                onChange={setDevice}
              />
            </div>

            {/* タスク名 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">プロジェクト名</Label>
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
                options={projectOptions}
                onChange={setType}
              />
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
              <Label>プロジェクト期間</Label>
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
