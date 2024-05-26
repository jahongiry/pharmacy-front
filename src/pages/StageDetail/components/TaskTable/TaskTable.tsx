import moment from "moment";
import 'moment/dist/locale/ru'
import {Button, Table, Typography} from "antd";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../../constants/url";
import {useNavigate, useParams} from "react-router-dom";
import {AddNewTaskModal} from "../../modals/AddNewTaskModal";
import {Dispatch, SetStateAction, useState} from "react";

import {ConfirmDeleteModal} from "../../../../components/ui/ConfirmDeleteModal";
import {FileUploader} from "react-drag-drop-files";
import {AddSubtaskModal} from "../../modals/AddSubtaskModal";
import addFile from "../../../../assets/icons/addFile.svg";
import {Tooltip} from "../../../../components/ui/Tooltip/Tooltip";
import editStage from "../../../../assets/icons/editStageIcon.svg";
import link from "../../../../assets/icons/link.svg";
import trash from "../../../../assets/icons/trash.svg";
import {SuccessModal} from "../../../../components/ui/successModal/SuccessModal";


const {Text} = Typography

interface IProps {
  isAddNewTask: boolean
  setIsAddNewTask: Dispatch<SetStateAction<boolean>>
  isCanEditStage: string | boolean
  dataStage: any
}

export const TaskTable = ({isAddNewTask, setIsAddNewTask, isCanEditStage, dataStage} : IProps) => {
  const {projectId, stageId} = useParams()
  const navigate = useNavigate()

  const { data, refetch } = useCustom({
    url: `${API_URL}/project/${projectId}/stage/${stageId}`,
    method: 'get',
  })

  const { mutate } = useCustomMutation<any>()


  const [isEditTask, setIsEditTask] = useState(false)
  const [isDeleteTask, setIsDeleteTask] = useState(false)
  const [isAddSubtask, setIsAddSubtask] = useState(false)
  const [clickedTask, setClickedTask] = useState<any>(undefined)

  const [showIdTooltip, setShowIdTooltip] = useState(0)
  const [typeTooltip, setTypeTooltip] = useState('')

  const [isSuccessModal, setIsSuccessModal] = useState(false)
  const [successText, setSuccessText] = useState('')


  const handleAddFile = (file: any) => {
    const formData = new FormData();

    formData.append('file', file)

    mutate({
      url: `${API_URL}/task/${clickedTask.id}/upload_file`,
      method: 'post',
      values: formData,
      successNotification: (): any => {
        refetch()

        setSuccessText('Файл добавлен')

        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)
      },
      errorNotification: (err) => {

        return {
          message: 'Не удалось добавить файл',
          type: 'error',
        }
      },
    })
  }

  const handleDeleteTask = () => {
    mutate({
      url: `${API_URL}/task/${clickedTask.id}`,
      method: 'delete',
      values: {},
      successNotification: (): any => {
        setIsDeleteTask(false)
        setClickedTask(undefined)
        refetch()

        setSuccessText('Задача удалена')

        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)
      },
      errorNotification: (err) => {
        setIsDeleteTask(false)
        setClickedTask(undefined)

        return {
          message: 'Не удалось удалить задачу',
          type: 'error',
        }
      },
    })
  }


  const columns = [
    {
      title: 'Название',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              navigate(`/task/${record.id}/${projectId}/${stageId}`)
            }}
          >
            {record.name}
          </Text>
        )
      }
    },
    {
      title: 'Описание',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              navigate(`/task/${record.id}/${projectId}/${stageId}`)
            }}
          >
            {record.description ? record.description : 'Не указано'}
          </Text>
        )
      }
    },
    {
      title: 'Статус',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              navigate(`/task/${record.id}/${projectId}/${stageId}`)
            }}
          >
            {record.status ? record.status : 'Не указано'}
          </Text>
        )
      }
    },
    {
      title: 'Дата окончания',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              navigate(`/task/${record.id}/${projectId}/${stageId}`)
            }}
          >
            {record.finished_at ? moment(record.finished_at).calendar('lll') : 'Не указана'}
          </Text>
        )
      }
    },
    {
      title: 'Исполнитель',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              navigate(`/task/${record.id}/${projectId}/${stageId}`)
            }}
          >
            {record.employee ? record.employee : 'Не указан'}
          </Text>
        )
      }
    },

    {
      title: 'Действия',
      width: 200,
      render: (record: {id: number}) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: '30px',
              alignItems: 'center'
            }}
          >
            <FileUploader
              handleChange={(file: any) => {
                handleAddFile(file as FileList)
              }}
              name="file"
            >
              <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                <button
                  onClick={() => {
                    setClickedTask(record)
                  }}
                  style={{
                    position: 'relative'
                  }}
                  onMouseOver={() => {
                    setShowIdTooltip(record.id)
                    setTypeTooltip('add')
                  }}
                  onMouseLeave={() => {
                    setShowIdTooltip(0)
                    setTypeTooltip('')
                  }}
                >
                  <img src={addFile} alt={'addFile'}/>
                  {record.id === showIdTooltip && typeTooltip === 'add' &&
                    <Tooltip
                      text={'Добавить файл'}
                      directionTriangle={'top'}
                      style={{
                        position: 'absolute',
                        top: '30px',
                        left: '-130px'
                      }}
                    />
                  }
                </button>
              </label>
            </FileUploader>

            {isCanEditStage &&
              <button
                onClick={() => {
                  setIsEditTask(true)
                  setClickedTask(record)
                }}
                style={{
                  position: 'relative'
                }}
                onMouseOver={() => {
                  setShowIdTooltip(record.id)
                  setTypeTooltip('edit')
                }}
                onMouseLeave={() => {
                  setShowIdTooltip(0)
                  setTypeTooltip('')
                }}
              >
                <img src={editStage} alt={'edit'}/>
                {record.id === showIdTooltip && typeTooltip === 'edit' &&
                  <Tooltip
                    text={'Изменить этап'}
                    directionTriangle={'top'}
                    style={{
                      position: 'absolute',
                      top: '30px',
                      left: '-130px'
                    }}
                  />
                }
              </button>
            }
            {isCanEditStage &&
              <button
                onClick={() => {
                  setIsAddSubtask(true)
                  setClickedTask(record)
                }}
                style={{
                  position: 'relative'
                }}
                onMouseOver={() => {
                  setShowIdTooltip(record.id)
                  setTypeTooltip('link')
                }}
                onMouseLeave={() => {
                  setShowIdTooltip(0)
                  setTypeTooltip('')
                }}
              >
                <img src={link} alt={'link'}/>
                {record.id === showIdTooltip && typeTooltip === 'link' &&
                  <Tooltip
                    text={'Добавить связанную задачу'}
                    directionTriangle={'top'}
                    style={{
                      position: 'absolute',
                      top: '30px',
                      left: '-175px'
                    }}
                  />
                }
              </button>
            }
            {isCanEditStage &&
              <button
                onClick={() => {
                  setIsDeleteTask(true)
                  setClickedTask(record)
                }}
                style={{
                  position: 'relative'
                }}
                onMouseOver={() => {
                  setShowIdTooltip(record.id)
                  setTypeTooltip('trash')
                }}
                onMouseLeave={() => {
                  setShowIdTooltip(0)
                  setTypeTooltip('')
                }}
              >
                <img src={trash} alt={'trash'}/>
                {record.id === showIdTooltip && typeTooltip === 'trash' &&
                  <Tooltip
                    text={'Удалить задачу'}
                    directionTriangle={'top'}
                    style={{
                      position: 'absolute',
                      top: '30px',
                      left: '-128px'
                    }}
                  />
                }
              </button>
            }
          </div>
        )
      }
    },
  ]

  return (
    <div>
      <Table
        style={{ marginTop: '30px' }}
        dataSource={data?.data?.tasks}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />
      <AddNewTaskModal
        isOpen={isAddNewTask || isEditTask}
        off={() => {
          setIsAddNewTask(false)
          setIsEditTask(false)
          setClickedTask(undefined)
        }}
        data={data}
        refetch={refetch}
        clickedTask={clickedTask}
        tasks={data?.data?.tasks}
        stageStartDate={dataStage?.data?.stage?.begin_at}
        stageFinishDate={dataStage?.data?.stage?.end_at}
      />
      <AddSubtaskModal
        tasks={data?.data?.tasks}
        clickedTask={clickedTask}
        off={() => {
          setIsAddSubtask(false)
          setClickedTask(undefined)
        }}
        isOn={isAddSubtask}
        refetch={refetch}
      />
      <ConfirmDeleteModal
        isOn={isDeleteTask}
        off={() => setIsDeleteTask(false)}
        handleOk={handleDeleteTask}
        title={'Удалить задачу?'}
      />

      {isSuccessModal &&
        <SuccessModal
          text={successText}
        />
      }
    </div>
  )
}
