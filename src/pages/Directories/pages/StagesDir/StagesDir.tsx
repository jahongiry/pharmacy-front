import {Table, Typography} from "antd";
import {useState} from "react";
import {CreateAndEditStageModal} from "./modals/CreateAndEditStageModal/CreateAndEditStageModal";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../../constants/url";
import {ConfirmDeleteModal} from "../../../../components/ui/ConfirmDeleteModal";
import {CreateChainModal} from "./modals/CreateChainModal/CreateChainModal";
import {BaseAddButton} from "../../../../components/ui/BaseAddButton/BaseAddButton";
import deleteStage from '../../../../assets/icons/deleteStageIcon.svg'
import addStage from '../../../../assets/icons/renameStageIcon.svg'
import editStage from '../../../../assets/icons/editStageIcon.svg'
import {Tooltip} from "../../../../components/ui/Tooltip/Tooltip";
import {SuccessModal} from "../../../../components/ui/successModal/SuccessModal";

const { Title, Text } = Typography

export const StagesDir = () => {
  const [isCreateStage, setIsCreateStage] = useState(false)
  const [isEditStage, setIsEditStage] = useState(false)
  const [isDeleteStage, setIsDeleteStage] = useState(false)
  const [clickedStage, setClickedStage] = useState<Record<string, string> | undefined>(undefined)
  const [isCreateChain, setIsCreateChain] = useState(false)
  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const [showIdTooltip, setShowIdTooltip] = useState(0)
  const [typeTooltip, setTypeTooltip] = useState('')

  const { data: dataStages, refetch } = useCustom<any[]>({
    url: `${API_URL}/stage/get_stages`,
    method: 'get',
  })

  const { mutate, isLoading } = useCustomMutation<any>()


  const handleDeleteStage = () => {
    mutate({
      url: `${API_URL}/stage/${clickedStage?.id}`,
      method: 'delete',
      values: {},
      successNotification: (): any => {
        setIsDeleteStage(false)
        setClickedStage(undefined)
        refetch()

        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)
      },
      errorNotification: (err) => {
        setIsDeleteStage(false)
        setClickedStage(undefined)

        return {
          message: 'Не удалось удалить этап',
          type: 'error',
        }
      },
    })
  }


  const columns = [
    {
      title: 'Название',
      dataIndex: 'name'
    },
    {
      title: 'Описание',
      dataIndex: 'description'
    },
    {
      title: 'Действие',
      width: 160,
      render: (record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: '16px',
            }}
          >
            <button
              onClick={() => {
                setIsEditStage(true)
                setClickedStage(record)
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
                    top: '25px',
                    left: '-130px'
                  }}
                />
              }
            </button>

            <button
              onClick={() => {
                setIsCreateChain(true)
                setClickedStage(record)
              }}
              style={{
                position: 'relative'
              }}
              onMouseOver={() => {
                setShowIdTooltip(record.id)
                setTypeTooltip('chain')
              }}
              onMouseLeave={() => {
                setShowIdTooltip(0)
                setTypeTooltip('')
              }}
            >
              <img src={addStage} alt={'addStage'}/>
              {record.id === showIdTooltip && typeTooltip === 'chain' &&
                <Tooltip
                  text={'Добавить цепочку'}
                  directionTriangle={'top'}
                  style={{
                    position: 'absolute',
                    top: '25px',
                    left: '-125px'
                  }}
                />
              }
            </button>

            <button
              onClick={() => {
                setIsDeleteStage(true)
                setClickedStage(record)
              }}
              style={{
                position: 'relative'
              }}
              onMouseOver={() => {
                setShowIdTooltip(record.id)
                setTypeTooltip('delete')
              }}
              onMouseLeave={() => {
                setShowIdTooltip(0)
                setTypeTooltip('')
              }}
            >
              <img src={deleteStage} alt={'deleteStage'}/>
              {record.id === showIdTooltip && typeTooltip === 'delete' &&  <Tooltip
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

  const stagesTable = dataStages?.data ? dataStages.data : []

  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Title>Этапы</Title>
        <BaseAddButton text={'Создать этап'} onClick={() => setIsCreateStage(true)} />
      </div>


      <Table
        style={{ marginTop: '30px' }}
        dataSource={stagesTable}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />

      <CreateAndEditStageModal
        isOpen={isCreateStage || isEditStage}
        off={() => {
          setIsEditStage(false)
          setIsCreateStage(false)
          setClickedStage(undefined)
        }}
        clickedStage={clickedStage}
        refetch={refetch}
      />
      <ConfirmDeleteModal
        isOn={isDeleteStage}
        off={() => setIsDeleteStage(false)}
        handleOk={handleDeleteStage}
        title={'Удалить Этап?'}
      />
      <CreateChainModal
        isOn={isCreateChain}
        off={() => {
          setIsCreateChain(false)
          setClickedStage(undefined)
          }
        }
        clickedStage={clickedStage}
        refetch={refetch}
      />
      {isSuccessModal &&
        <SuccessModal
          text={'Этап удален'}
        />
      }
    </section>
  )
}
