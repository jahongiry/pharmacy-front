import { Modal} from "antd";
import {SelectComponent} from "../../../components/ui/SelectComponents/SelectComponent";
import {useEffect, useState} from "react";
import {useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../constants/url";
import {ModalTitle} from "../../../components/ui/modalTitle/ModalTitle";
import save from "../../../assets/icons/link.svg";
import close from "../../../assets/icons/Close.svg";
import {LowButtons} from "../../Users/modals/LowButtons";
import {SuccessModal} from "../../../components/ui/successModal/SuccessModal";

interface IProps {
  isOn: boolean
  off: () => void
  clickedTask: any
  tasks: any
  refetch: any
}

export const AddSubtaskModal = ({isOn, off, clickedTask, tasks, refetch}: IProps) => {
  const { mutate, isLoading } = useCustomMutation<any>()
  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const [body, setBody] = useState({
    name: "",
    description: "",
    finished_at: null,
    status_id: null,
    employee_id: null,
    parent_id_task: null,
    created_at: '',
    linked_tasks: []
  })

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

  const handleCloseModal = () => {
    off()
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

  const handleOk = () => {
    mutate({
      url: `${API_URL}/task/${clickedTask.id}`,
      method: 'put',
      values: body,
      successNotification: (): any => {
        refetch()
        setIsSuccessModal(true)
        handleCloseModal()

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)
      },
      errorNotification: (err) => {
        handleCloseModal()

        return {
          message: 'Не удалось добавить маязанные задачи',
          type: 'error',
        }
      },
    })
  }

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
        linked_tasks: clickedTask?.linked?.map((el: {id: number}) => el.id)
      }
      setBody(body)
    }
  }, [clickedTask])

  return (
    <>
      <Modal
        open={isOn}
        onCancel={handleCloseModal}
        footer={[]}
      >
        <ModalTitle title={'Добавить связанную задачу'}/>
        <div
          style={{
            marginTop: '17px'
          }}
        >
          <SelectComponent
            selectArray={tasksDropDown}
            placeholder={'Связанные задачи'}
            selectedValue={!body.linked_tasks ? undefined : body.linked_tasks}
            onChange={(ids) => {
              setBody((prevState) => {
                return {
                  ...prevState,
                  linked_tasks: ids
                }
              })
            }}
            isMultiple
          />
        </div>

        <LowButtons
          textOk={'Добавить'}
          iconOk={save}
          textCancel={'Отменить'}
          iconCancel={close}
          handleClickOk={handleOk}
          handleClickClose={handleCloseModal}
        />
      </Modal>

      {isSuccessModal &&
        <SuccessModal
          text={'Связанные подзадачи добавлены'}
        />
      }

    </>
  )
}
