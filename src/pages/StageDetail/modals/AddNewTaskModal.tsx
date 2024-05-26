import {Input, Modal} from "antd";
import {useEffect, useState} from "react";
import TextArea from "antd/lib/input/TextArea";
import {CalendarComponent} from "../../Projects/modals/components/CalendarComponent";
import dayjs from "dayjs";
import moment from "moment/moment";
import {SelectComponent} from "../../../components/ui/SelectComponents/SelectComponent";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../constants/url";
import {useParams} from "react-router-dom";
import save from "../../../assets/icons/Save.svg";
import close from "../../../assets/icons/Close.svg";
import {LowButtons} from "../../Users/modals/LowButtons";
import {ModalTitle} from "../../../components/ui/modalTitle/ModalTitle";
import s from "../../Directories/pages/StagesDir/modals/CreateAndEditStageModal/index.module.css";
import {SuccessModal} from "../../../components/ui/successModal/SuccessModal";
import {CalendarHelper} from "../../Projects/helpers/CalendarHelper";

export interface BodyTypes {
  name: string
  description: string
  created_at: Date | string
  finished_at: Date | string | null
  status_id: null | number
  employee_id: null | number
  parent_id_task: null | number
  linked_tasks: any[]
}


interface IProps {
  isOpen: boolean
  off: () => void
  data: any
  refetch: any
  clickedTask: any
  tasks: any
  stageStartDate: string
  stageFinishDate: string
}
export const AddNewTaskModal = (
  {
    isOpen,
    off,
    data,
    refetch,
    clickedTask,
    tasks,
    stageStartDate,
    stageFinishDate
  } : IProps) => {
  const {projectId, stageId} = useParams()
  const { mutate, isLoading } = useCustomMutation<any>()

  const [isSendData, setIsSendData] = useState(false)
  const [body, setBody] = useState<BodyTypes>({
    name: "",
    description: "",
    finished_at: null,
    status_id: null,
    employee_id: null,
    parent_id_task: null,
    created_at: '',
    linked_tasks: []
  })

  const [employees, setEmployees] = useState<any>()

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const { data: dataStatuses } = useCustom<any[]>({
    url: `${API_URL}/status/get_statuses`,
    method: 'get',
  })

  const statusesData = dataStatuses?.data
    ? dataStatuses.data.map(el => {
      return {
        key: el.status.id,
        label: el.status.name
      }
    })
    : []

  const allTasks = tasks?.length
    ? tasks?.map((el: any) => {
      return {
        key: el.id,
        label: el.name
      }
    })
    : []

  const tasksDropDown = clickedTask
    ? allTasks.filter((el: {key: number}) => el.key !== clickedTask.id)
    : allTasks

  const {toISOStringWithTimezone} = CalendarHelper()


  const handleCloseModal = () => {
    off()
    setIsSendData(false)
    setBody(
      {
        name: "",
        description: "",
        finished_at: null,
        status_id: null,
        employee_id: null,
        parent_id_task: null,
        created_at: '',
        linked_tasks: []
      }
    )
  }

  const handleCreateTask = () => {
    setIsSendData(true)
    if(
      body.name && body.created_at
    ) {
      mutate({
        url: clickedTask ? `${API_URL}/task/${clickedTask.id}` : `${API_URL}/project/${projectId}/stage/${stageId}/create_task`,
        method: clickedTask ? 'put' : 'post',
        values: body,
        successNotification: (): any => {
          setIsSuccessModal(true)
          handleCloseModal()

          setTimeout(() => {
            setIsSuccessModal(false)
          }, 3000)

          refetch()
        },
        errorNotification: (err) => {
          handleCloseModal()

          return {
            message: `Не удалось ${clickedTask ? 'изменить' : 'создать'} задачу`,
            type: 'error',
          }
        },
      })
    }
  }


  useEffect(() => {
    if(data?.data?.performers?.length) {
      const array: any[] = []

      data?.data?.performers.map((el: any) => {
        array.push({
          key: el.id,
          label: el.username,
        })
      })

      setEmployees(array)
    }
    if(data?.data?.stage?.begin_at) {
      setBody((prev) => {
        return {
          ...prev,
          created_at: data?.data?.stage?.begin_at
        }
      })
    }
  }, [data])

  useEffect(() => {
    if(clickedTask) {
      const body = {
        name: clickedTask.name,
        description: clickedTask.description,
        finished_at: clickedTask.finished_at,
        status_id: clickedTask.status_id,
        employee_id: clickedTask.employee_id,
        parent_id_task: clickedTask.parent_id_task ?? null,
        created_at: clickedTask?.created_at,
        linked_tasks: clickedTask?.linked ? clickedTask?.linked?.map((el: {id: number}) => el.id) : []
      }
      setBody(body)
    }
  }, [clickedTask, isOpen])

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleCloseModal}
        footer={[]}
        style={{
          minWidth: '785px',
          overflow: 'hidden',
          margin: '0 auto'
        }}
      >
        <ModalTitle title={'Задача'}/>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            gap: '15px',
            margin: '16px 0',
            alignItems: 'center',
            maxWidth: '565px'
          }}
        >
          <p
            className={s.description}
          >
            * Название :
          </p>
          <Input
            placeholder={'Название'}
            value={body.name}
            onChange={(e) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  name: e.target.value
                }
              })
            }}
            status={isSendData && !body.name ? 'error' : ''}
            className={s.input}
          />

          <p
            className={s.description}
          >
            Описание :
          </p>

          <TextArea
            placeholder={'Описание'}
            value={body.description}
            onChange={(e) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  description: e.target.value
                }
              })
            }}
            className={s.input}
          />
          <p
            className={s.description}
          >
            Статус :
          </p>
          <SelectComponent
            selectArray={statusesData}
            placeholder={'Текущий статус задачи'}
            selectedValue={!body.status_id ? undefined : body.status_id}
            onChange={(ids) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  status_id: ids
                }
              })
            }}
            className={s.input}
          />

          <p
            className={s.description}
          >
            * Сроки :
          </p>

          <div>
            <CalendarComponent
              value={[body.created_at ? dayjs(body.created_at) : '', body.finished_at ? dayjs(body.finished_at) : undefined]}
              onChange={(day) => {
                setBody((prevState) => {
                  return {
                    ...prevState,
                    created_at: toISOStringWithTimezone(day[0].$d).replace(/Z$/, ''),
                    finished_at: toISOStringWithTimezone(day[1].$d).replace(/Z$/, '')
                  }
                })
              }}
              hasError={isSendData && !body.created_at}
              minDate={dayjs(stageStartDate)}
              maxDate={dayjs(stageFinishDate)}
              disabledDate={(current: any) => {
                const startDate = moment(stageStartDate);
                const endDate = moment(stageFinishDate);

                current = current.subtract(-1, 'day');

                if (current && current < moment().startOf('day')) {
                  return true;
                }

                if (startDate && current && (current < startDate.endOf('day'))) {
                  return true;
                }

                if (endDate && current && (current > endDate.endOf('day').add(1, 'day'))) {
                  return true;
                }

                return false;
              }}
            />
          </div>

          <p
            className={s.description}
          >
            Исполнители :
          </p>

          <SelectComponent
            selectArray={employees}
            placeholder={'Исполнители'}
            selectedValue={!body.employee_id ? undefined : body.employee_id}
            onChange={(ids) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  employee_id: ids
                }
              })
            }}
            className={s.input}
          />

          <p
            className={s.description}
          >
            Подзадача :
          </p>

          <SelectComponent
            selectArray={tasksDropDown}
            placeholder={'Подзадача'}
            selectedValue={!body.parent_id_task ? undefined : body.parent_id_task}
            onChange={(ids) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  parent_id_task: ids
                }
              })
            }}
            className={s.input}
          />
        </div>

        <LowButtons
          textOk={'Сохранить'}
          iconOk={save}
          textCancel={'Отменить'}
          iconCancel={close}
          handleClickOk={handleCreateTask}
          handleClickClose={handleCloseModal}
        />
      </Modal>

      {isSuccessModal &&
        <SuccessModal
          text={clickedTask ? 'Задача изменена' : 'Задача создана'}
        />
      }
    </>

  )
}
