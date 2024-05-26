import {Table, Typography} from "antd";
import moment from "moment";
import {useNavigate, useParams} from "react-router-dom";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../constants/url";
import {AddStage} from "../modals/AddStage";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../context/AuthProvider";
import {FileUploader} from "react-drag-drop-files";
import editStage from "../../../assets/icons/editStageIcon.svg";
import addFile from "../../../assets/icons/addFile.svg";
import {Tooltip} from "../../../components/ui/Tooltip/Tooltip";
import {SuccessModal} from "../../../components/ui/successModal/SuccessModal";

const {Text} = Typography

interface IProps {
  dataProject: any
}
export const StagesTable = ({dataProject}: IProps) => {
  const {projectId} = useParams()
  const navigate = useNavigate()

  const { data, refetch } = useCustom({
    url: `${API_URL}/project/${projectId}/stage/list`,
    method: 'get',
  })

  const [isEditStage, setIsEditStage] = useState(false)
  const [clickedStage, setClickedStage] = useState<any>(undefined)
  const [tableData, setTableData] = useState<any>([])

  const [isSuccessModal, setIsSuccessModal] = useState(false)
  const [successText, setSuccessText] = useState('')

  const [showIdTooltip, setShowIdTooltip] = useState(0)
  const [typeTooltip, setTypeTooltip] = useState('')

  const { mutate, isLoading } = useCustomMutation<any>()

  const { userData } = useContext(AuthContext);

  const isCanWorkWithStages = data?.data
    ?  userData?.is_superuser || dataProject?.data?.working_group?.employees?.some((el: {user_id_fk: string}) => el.user_id_fk === userData?.id)
    :  false

  const handleAddFile = (file: any) => {

    const formData = new FormData();

    formData.append('file', file)

    mutate({
      url: `${API_URL}/project/${projectId}/stage/${clickedStage.stage.id}/upload_file`,
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


  const columns = [
    {
      title: 'Название',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => navigate(`stage/${record.stage.id}`)}
          >
            {record?.stage?.stage ? record.stage.stage : 'Не указано'}
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
            onClick={() => navigate(`stage/${record.stage.id}`)}
          >
            {record?.stage?.status ? record.stage.status : 'Не указан'}
          </Text>
        )
      }
    },
    {
      title: 'Начало',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => navigate(`stage/${record.stage.id}`)}
          >
            {record.stage.begin_at ? moment(record.stage.begin_at).calendar('lll') : 'Не выбрано'}
          </Text>
        )
      }
    },
    {
      title: 'Окончание',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => navigate(`stage/${record.stage.id}`)}
          >
            {record.stage.end_at ? moment(record.stage.end_at).calendar('lll') : 'Не выбрано'}
          </Text>
        )
      }
    },
    {
      title: 'Описание',
      render: (record: any) => {
        return (
          <Text
            onClick={() => navigate(`stage/${record.stage.id}`)}
            style={{
              cursor: 'pointer'
            }}
          >
            {record?.stage?.description ? record.stage.description : 'Не указано'}
          </Text>
        )
      }
    },
    {
      title: 'Сотрудники',
      render: (record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`stage/${record.stage.id}`)}
          >
            {
              record?.performers?.length
              ? record?.performers.map((el: any) => {
                  return (
                    <Text>{el.username}</Text>
                  )
                })
              : 'Не выбраны'
            }
          </div>
        )
      }
    },
    {
      title: 'Действия',
      width: 110,
      render: (record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: '30px',
              alignItems: 'center'
            }}
          >
            {isCanWorkWithStages &&
              <button
                onClick={() => {
                  setIsEditStage(true)
                  setClickedStage(record)
                }}
                style={{
                  position: 'relative'
                }}
                onMouseOver={() => {
                  setShowIdTooltip(record.stage.id)
                  setTypeTooltip('edit')
                }}
                onMouseLeave={() => {
                  setShowIdTooltip(0)
                  setTypeTooltip('')
                }}
              >
                <img src={editStage} alt={'edit'}/>
                {record.stage.id === showIdTooltip && typeTooltip === 'edit' &&
                  <Tooltip
                    text={'Изменить этап'}
                    directionTriangle={'top'}
                    style={{
                      position: 'absolute',
                      top: '25px',
                      left: '-130px'
                    }}
                  />
                }
              </button>
            }


            {isCanWorkWithStages &&
              <FileUploader
                handleChange={(file: any) => {
                  handleAddFile(file as FileList)
                }}
                name="file"
              >
                <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                  <button
                    onClick={() => {
                      setClickedStage(record)
                    }}
                    style={{
                      position: 'relative'
                    }}
                    onMouseOver={() => {
                      setShowIdTooltip(record.stage.id)
                      setTypeTooltip('add')
                    }}
                    onMouseLeave={() => {
                      setShowIdTooltip(0)
                      setTypeTooltip('')
                    }}
                  >
                    <img src={addFile} alt={'addFile'}/>
                    {record.stage.id === showIdTooltip && typeTooltip === 'add' &&
                      <Tooltip
                        text={'Добавить файл'}
                        directionTriangle={'top'}
                        style={{
                          position: 'absolute',
                          top: '25px',
                          left: '-130px'
                        }}
                      />
                    }
                  </button>
                </label>
              </FileUploader>
            }
          </div>
        )
      }
    },
  ]

  useEffect(() => {
    if(data?.data) {
      const initArr: any[] = []
      data?.data?.map((el: any) => {
        return  el.map((item: any) => {
          initArr.push(item)
        })
      })
      setTableData(initArr)
    }
  }, [data])


  return (
    <>
      <Table
        style={{ marginTop: '30px' }}
        dataSource={tableData}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />

      {isEditStage &&
        <AddStage
          isOn={isEditStage}
          off={() => setIsEditStage(false)}
          projectFinishDate={dataProject?.data?.description.finished_at}
          projectStartDate={dataProject?.data?.description.created_at}
          refetch={refetch}
          clickedStage={clickedStage}
          dataProject={dataProject}
        />
      }

      {isSuccessModal &&
        <SuccessModal
          text={successText}
        />
      }
    </>
  )
}
