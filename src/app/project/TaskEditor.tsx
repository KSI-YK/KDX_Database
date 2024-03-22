import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Status, TaskTypes, Tasks, User } from '@prisma/client'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { utcToZonedTime, format } from 'date-fns-tz'
import Select, { ActionMeta, MultiValue } from 'react-select'
import { DatePickerWithRange } from '@/components/DatePickerWithRange'
import { TaskWith } from '@/types'
import { editTask } from './ApiReqProject'
import { fetchTaskWithProject } from './ApiReqProject'


interface Props {
  task: TaskWith
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  projectId: string
  setTask: React.Dispatch<React.SetStateAction<TaskWith[]>>
}

interface Option {
  value: string
  label: string
}


export function TaskEditor({
  isOpen,
  setIsOpen,
  task,
  projectId,
  setTask,
}: Props) {
  // -------フックスでの入力監視
  // タスク名
  const [inputName, setName] = useState(task.name)
  // 種別
  const [selectedType, setType] = useState<Option | null>(null)
  // 依頼者
  const [selectedCreator, setCreator] = useState<Option | null>(null)
  // 責任者
  const [selectedDirector, setDirector] = useState<Option | null>(null)
  // 担当者（配列）
  const [selectedManagers, setManagers] = useState<Option[] | null>([])
  // タスクの開始日と終了日
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  // Userのリスト
  const [user, setUser] = useState<User[] | null>([])
  // taskTypesのリスト
  const [taskTypes, setTypes] = useState<TaskTypes[] | null>([])

  // Optionsを適切な形式に変換
  const userOptions = user?.map((user) => ({
    value: user.id,
    label: user.name,
  }))
  const taskOptions = taskTypes?.map((taskType) => ({
    value: taskType.id,
    label: taskType.name,
  }))

  // DatePickerWithRangeから日付範囲の変更を受け取る
  const handleDateChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange)
  }

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

  // UserとTaskTypesのリストを全件取得する
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user')
        const userList = await response.json()
        const res = await fetch('http://localhost:3000/api/tasktypes')
        const taskTypesList = await res.json()
        // 取得したデータでsystemsステートを更新します
        setUser(userList.user)
        setTypes(taskTypesList.taskTypes)
      } catch (error) {
        console.error('システムの取得に失敗しました:', error)
      }
    }
    fetchSystems()
  }, []) // 依存配列を空にすることで、コンポーネントがマウントされた時にのみ実行されます

  // 編集中のtaskの初期値を全てOption形式{Label, Value}に分離して、useStateに投げる
  useEffect(() => {
    // 種別
    if (task.typeId) {
      const initialType: Option = {
        value: task.type.id,
        label: task.type.name,
      }
      setType(initialType)
    }

    // 依頼者
    if (task.creator) {
      const initialCreator: Option = {
        value: task.creator.id,
        label: task.creator.name,
      }
      setCreator(initialCreator)
    }

    // 責任者
    if (task.director) {
      const initialDirector: Option = {
        value: task.director.id,
        label: task.director.name,
      }
      setDirector(initialDirector)
    }

    // 担当者
    if (task.managers) {
      const initialManagers = task.managers.map((manager) => ({
        value: manager.id,
        label: manager.name,
      }))
      setManagers(initialManagers)
    }

    // 開始日と終了日
    if (task.startDate && task.endDate) {
      // 文字列をDateオブジェクトに変換（task.startDateとtask.endDateが文字列の場合）
      const startDate = new Date(task.startDate)
      const endDate = task.endDate
        ? new Date(task.endDate)
        : new Date(task.startDate) // endDateがundefinedならstartDateと同じ値を使う

      setDateRange({ from: startDate, to: endDate })
    }
  }, [task]) // taskが変更された時に実行

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

  // Save changesが押された時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // フォームのデフォルトの送信を防ぎます

    const startDate = formatDateTime(dateRange?.from)
    const endDate = formatDateTime(dateRange?.to)
    if (
      inputName &&
      selectedType &&
      task.statusId &&
      selectedCreator &&
      selectedDirector &&
      selectedManagers
    ) {
      const managerValues = selectedManagers
        ? selectedManagers.map((manager) => manager.value)
        : []

      try {
        await editTask(
          inputName,
          selectedType.value,
          task.statusId,
          selectedCreator.value,
          selectedDirector.value,
          managerValues,
          startDate,
          endDate,
          task.id,
        )
        // ここでDialogを閉じて、親コンポーネントのデータを更新する
        setIsOpen(false) // Dialogを閉じる
        fetchTaskWithProject(projectId, setTask) // 親コンポーネントで定義されたデータ更新関数を呼び出す
      } catch (error) {
        console.error('タスクの更新に失敗しました:', error)
        alert('更新に失敗しました')
      }
    } else {
      alert('入力不足です')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>{task.name}の編集</DialogDescription>
        </DialogHeader>

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
                defaultValue={inputName}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 種別入力 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="status">種別</Label>
              <Select
                id="status"
                name="status"
                value={selectedType}
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                options={taskOptions}
                onChange={setType}
              />
            </div>

            {/* 依頼者選択 */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="director">依頼者</Label>
              <Select
                id="director"
                name="director"
                value={selectedCreator}
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
                value={selectedDirector}
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
                value={selectedManagers}
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                isSearchable={true}
                options={userOptions}
                onChange={handleSelectChange}
              />
            </div>

            {/* 開始→終了の期間選択 */}
            <div className="grid w-full max-w-sm items-center gap-1.5 pb-4">
              <Label>タスク期間</Label>
              <DatePickerWithRange
                className=""
                defaultDateRange={dateRange}
                onDateChange={handleDateChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
