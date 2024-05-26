import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../../../../../constants/url";
import {Table, Typography} from "antd";
import {useState} from "react";
import {CreateChainModal} from "../../modals/CreateChainModal/CreateChainModal";
import {ConfirmDeleteModal} from "../../../../../../components/ui/ConfirmDeleteModal";
import {AddChainPredecessorModal} from "./modals/AddChainPredecessorModal";
import {AddChainFollowerModal} from "./modals/AddChainFollowerModal";
import {useNavigate} from "react-router-dom";
import rename from '../../../../../../assets/icons/rename.svg'
import predecessor from '../../../../../../assets/icons/predecessor.svg'
import follower from '../../../../../../assets/icons/follower.svg'
import {Tooltip} from "../../../../../../components/ui/Tooltip/Tooltip";
import deleteStage from "../../../../../../assets/icons/deleteStageIcon.svg";
import s from './index.module.css'
import {SuccessModal} from "../../../../../../components/ui/successModal/SuccessModal";

const {Title, Text} = Typography

interface IProps {
  dataStages: any
}
export const ChainsTable = ({dataStages}: IProps) => {
  const { mutate, isLoading } = useCustomMutation<any>()

  const { data: dataChains, refetch } = useCustom<any[]>({
    url: `${API_URL}/chain/list`,
    method: 'get',
  })
  const navigate = useNavigate()

  const [isRenameChain, setIsRenameChain] = useState(false)
  const [isDeleteChain, setIsDeleteChain] = useState(false)

  const [isAddPredecessor, setIsAddPredecessor] = useState(false)
  const [isAddFollower, setIsAddFollower] = useState(false)

  const [showIdTooltip, setShowIdTooltip] = useState(0)
  const [typeTooltip, setTypeTooltip] = useState('')

  const [clickedChain, setClickedChain] = useState<any>(undefined)

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const handleDeleteChain = () => {
    mutate({
      url: `${API_URL}/chain/${clickedChain.id}`,
      method: 'delete',
      values: {},
      successNotification: (): any => {
        setIsDeleteChain(false)
        setClickedChain(undefined)
        refetch()

        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)
      },
      errorNotification: (err) => {
        setIsDeleteChain(false)
        setClickedChain(undefined)

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
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              navigate(`/chain/${record.id}`)
            }}
          >
            {record.name}
          </Text>
        )
      }
    },
    {
      title: 'Этап-родитель',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/chain/${record.id}`)}
          >
            {record.root.name}
          </Text>
        )
      }
    },
    {
      title: 'Действие',
      width: 210,
      render: (record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center'
            }}
          >
            <button
              className={s.button}
              onClick={() => {
                setClickedChain(record)
                setIsRenameChain(true)
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
              <img src={rename} alt={'rename'}/>
              {record.id === showIdTooltip && typeTooltip === 'edit' &&
                <Tooltip
                  text={'Изменить'}
                  directionTriangle={'top'}
                  style={{
                    position: 'absolute',
                    top: '30px',
                    left: '-120px'
                  }}
                />
              }
            </button>
            <button
              className={s.button}
              onClick={() => {
                setIsAddFollower(true)
                setClickedChain(record)
              }}
              style={{
                position: 'relative'
              }}
              onMouseOver={() => {
                setShowIdTooltip(record.id)
                setTypeTooltip('follower')
              }}
              onMouseLeave={() => {
                setShowIdTooltip(0)
                setTypeTooltip('')
              }}
            >
              <img src={follower} alt={'follower'}/>
              {record.id === showIdTooltip && typeTooltip === 'follower' &&
                <Tooltip
                  text={'Добавить предшественника'}
                  directionTriangle={'top'}
                  style={{
                    position: 'absolute',
                    top: '30px',
                    left: '-170px'
                  }}
                />
              }
            </button>
            <button
              onClick={() => {
                setIsAddPredecessor(true)
                setClickedChain(record)
              }}
              style={{
                position: 'relative'
              }}
              className={s.button}
              onMouseOver={() => {
                setShowIdTooltip(record.id)
                setTypeTooltip('predecessor')
              }}
              onMouseLeave={() => {
                setShowIdTooltip(0)
                setTypeTooltip('')
              }}
            >
              <img
                src={predecessor}
                alt={'predecessor'}
                style={{
                  width: '16px',
                  height: '16px',
                  marginLeft: '-3px'
                }}

              />
              {record.id === showIdTooltip && typeTooltip === 'predecessor' &&
                <Tooltip
                  text={'Добавить последователя'}
                  directionTriangle={'top'}
                  style={{
                    position: 'absolute',
                    top: '30px',
                    left: '-150px'
                  }}
                />
              }
            </button>

            <button
              onClick={() => {
                setIsDeleteChain(true)
                setClickedChain(record)
              }}
              className={s.button}
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
              <img
                src={deleteStage}
                alt={'deleteStage'}
                style={{
                  width: '16px',
                  height: '16px',
                }}
              />
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

  return (
    <section>
      <Title>Цепочки</Title>

      <Table
        style={{ marginTop: '30px' }}
        dataSource={dataChains ? dataChains.data : []}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />

      <CreateChainModal
        isOn={isRenameChain}
        off={() => {
          setIsRenameChain(false)
          setClickedChain(undefined)
        }}
        clickedChain={clickedChain}
        refetch={refetch}
      />

      <ConfirmDeleteModal
        isOn={isDeleteChain}
        off={() => setIsDeleteChain(false)}
        handleOk={handleDeleteChain}
        title={'Удалить цепочку?'}
        description={'Цепочка будет удалена без возможности восстановления, однако этапы останутся доступны в справочнике'}
      />
      {isAddPredecessor &&
        <AddChainPredecessorModal
          isOn={isAddPredecessor}
          off={() => {
            setIsAddPredecessor(false)
            setClickedChain(undefined)
          }}
          chain_id={clickedChain?.id}
          refetch={refetch}
          dataStages={dataStages}
        />
      }
      {isAddFollower &&
        <AddChainFollowerModal
          isOn={isAddFollower}
          off={() => {
            setIsAddFollower(false)
            setClickedChain(undefined)
          }}
          chain_id={clickedChain?.id}
          refetch={refetch}
          dataStages={dataStages}
        />
      }
      {isSuccessModal &&
        <SuccessModal
          text={'Цепочка удалена'}
        />
      }
    </section>
  )
}
