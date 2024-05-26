import {Table, Typography} from "antd";
import {useState} from "react";
import {CreateAndEditStatuses} from "./modals/CreateAndEditStatuses";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../../constants/url";
import {ConfirmDeleteModal} from "../../../../components/ui/ConfirmDeleteModal";
import {BaseAddButton} from "../../../../components/ui/BaseAddButton/BaseAddButton";
import editStage from "../../../../assets/icons/editStageIcon.svg";
import {Tooltip} from "../../../../components/ui/Tooltip/Tooltip";
import deleteStage from "../../../../assets/icons/deleteStageIcon.svg";
import {SuccessModal} from "../../../../components/ui/successModal/SuccessModal";

const {Title, Text} = Typography

export const StatusDir = () => {
  const [isCreateStatus, setIsCreateStatus] = useState(false)
  const [isEditStatus, setIsEditStatus] = useState(false)
  const [isDeleteStatus, setIsDeleteStatus] = useState(false)
  const [clickedStatus, setClickedStatus] = useState<Record<string, any> | undefined>(undefined)

  const [showIdTooltip, setShowIdTooltip] = useState(0)
  const [typeTooltip, setTypeTooltip] = useState('')

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const { data: dataStatuses, refetch } = useCustom<any[]>({
    url: `${API_URL}/status/get_statuses`,
    method: 'get',
  })


  const { mutate, isLoading } = useCustomMutation<any>()

  const handleDeleteStatus = () => {
    mutate({
      url: `${API_URL}/status/${clickedStatus?.status.id}`,
      method: 'delete',
      values: {},
      successNotification: (): any => {
        setIsDeleteStatus(false)
        refetch()

        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)
      },
      errorNotification: (err) => {
        setIsDeleteStatus(false)
        setClickedStatus(undefined)

        return {
          message: 'Не удалось удалить статус',
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
          <Text>{record.status.name}</Text>
        )
      }
    },
    {
      title: 'Статусы-последователи',
      render: (record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}
          >
            {record?.transitions.length
              ?
                record.transitions.map((el: any) => {
                  return (
                    el.map((item: {name: string}) => {
                      return <Text>{item.name}</Text>
                    })
                  )
                })
              : '-'
            }
          </div>
        )
      }
    },
    {
      title: 'Действие',
      width: 130,
      render: (record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: '25px'
            }}
          >
            <button
              onClick={() => {
                setIsEditStatus(true)
                setClickedStatus(record)
              }}
              style={{
                position: 'relative'
              }}
              onMouseOver={() => {
                setShowIdTooltip(record.status.id)
                setTypeTooltip('edit')
              }}
              onMouseLeave={() => {
                setShowIdTooltip(0)
                setTypeTooltip('')
              }}
            >
              <img src={editStage} alt={'edit'}/>
              {record.status.id === showIdTooltip && typeTooltip === 'edit' &&
                <Tooltip
                  text={'Изменить статус'}
                  directionTriangle={'top'}
                  style={{
                    position: 'absolute',
                    top: '25px',
                    left: '-130px'
                  }}
                />
              }
            </button>

            <button
              onClick={() => {
                setIsDeleteStatus(true)
                setClickedStatus(record)
              }}
              style={{
                position: 'relative'
              }}
              onMouseOver={() => {
                setShowIdTooltip(record.status.id)
                setTypeTooltip('delete')
              }}
              onMouseLeave={() => {
                setShowIdTooltip(0)
                setTypeTooltip('')
              }}
            >
              <img src={deleteStage} alt={'deleteStage'}/>
              {record.status.id === showIdTooltip && typeTooltip === 'delete' &&  <Tooltip
                text={'Удалить'}
                directionTriangle={'top'}
                style={{
                  position: 'absolute',
                  top: '25px',
                  left: '-130px'
                }}
              />}
            </button>
          </div>
        )
      }
    }
  ]

  const statusesData = dataStatuses?.data ? dataStatuses.data : []

  return (
    <section>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Title>Статусы</Title>
        <BaseAddButton text={'Добавить статус'} onClick={() => setIsCreateStatus(true)} />
      </div>


      <Table
        style={{ marginTop: '30px' }}
        dataSource={statusesData}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />

      <CreateAndEditStatuses
        isOn={isCreateStatus || isEditStatus}
        off={() => {
          setIsCreateStatus(false)
          setIsEditStatus(false)
          setClickedStatus(undefined)
        }}
        clickedStatus={clickedStatus}
        refetch={refetch}
        dataStatuses={dataStatuses}
      />

      <ConfirmDeleteModal
        isOn={isDeleteStatus}
        off={() => setIsDeleteStatus(false)}
        handleOk={handleDeleteStatus}
        title={'Удалить статус?'}
      />

      {isSuccessModal &&
        <SuccessModal
          text={'Статус удален'}
        />
      }
    </section>
  )
}
