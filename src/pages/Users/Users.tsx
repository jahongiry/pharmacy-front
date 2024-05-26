import {Table, Typography} from "antd";
import {useContext, useState} from "react";
import {ConfirmDeleteModal} from "../../components/ui/ConfirmDeleteModal";
import {useCustom, useCustomMutation} from "@refinedev/core";
import {API_URL} from "../../constants/url";
import {UpdateUser} from "./modals/UpdateUser";
import {CreateNewUser} from "./modals/CreateNewUser";
import {AuthContext} from "../../context/AuthProvider";
import editStage from "../../assets/icons/editStageIcon.svg";
import {Tooltip} from "../../components/ui/Tooltip/Tooltip";
import trash from "../../assets/icons/trash.svg";
import {PageTitle} from "../../components/ui/PageTitle/PageTitle";
import {BaseAddButton} from "../../components/ui/BaseAddButton/BaseAddButton";
import {SuccessModal} from "../../components/ui/successModal/SuccessModal";

const {Text, Title} = Typography

export const Users = () => {
  const [isDelete, setIsDelete] = useState(false)
  const [isUpdateUser, setIsUpdateUser] = useState(false)
  const [isCreateNewUser, setIsCreateNewUser] = useState(false)

  const [showIdTooltip, setShowIdTooltip] = useState(0)
  const [typeTooltip, setTypeTooltip] = useState('')

  const [isSuccessModal, setIsSuccessModal] = useState(false)

  const [clickedUserId, setCLickedUserId] = useState(0)
  const [clickedUserData, setClickedUserData] = useState<Record<string, string>>()

  const { data, isLoading: isLoadingUsers, refetch } = useCustom<any[]>({
    url: `${API_URL}/auth/get_users`,
    method: 'get',
  })

  const { userData } = useContext(AuthContext);
  // если пользователь не админ, раздел закрыт
  if(!userData?.is_superuser) return <Title level={3} style={{marginTop: '20px'}}>Вам запрещен доступ в данный раздел, свяжитесь с администратором</Title>

  const { mutate, isLoading } = useCustomMutation<any>()

  const columns = [
    {
      title: 'Имя и фамилия',
      dataIndex: 'username'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Категория',
      render: (record: any) => {
        return (
          <div
            style={{
              display: 'flex',
            }}
          >
            <Text>Сотрудник</Text>
            <Text>{record.is_superuser ? ', Администратор' : ''}</Text>
            <Text>{record.is_project_manager ? ', Руководитель проектов' : ''}</Text>
          </div>
        )
      }
    },
    {
      title: 'Действие',
      width: 100,
      render: (record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              gap: '30px',
              alignItems: 'center'
            }}
          >
            {record.hashed_password &&
              <button
                onClick={() => {
                  setCLickedUserId(record.id)
                  setIsUpdateUser(true)
                  setClickedUserData(record)
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
                    text={'Изменить'}
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

            <button
              onClick={() => {
                setCLickedUserId(record.id)
                setIsDelete(true)
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
                  text={'Удалить'}
                  directionTriangle={'top'}
                  style={{
                    position: 'absolute',
                    top: '30px',
                    left: '-128px'
                  }}
                />
              }
            </button>
          </div>
        )
      }
    }
  ]

  const handleDeleteUser = () => {
    mutate({
      url: `${API_URL}/auth/delete_user/${clickedUserId}`,
      method: 'delete',
      values: {},
      successNotification: (): any => {
        refetch()
        setIsDelete(false)

        setIsSuccessModal(true)

        setTimeout(() => {
          setIsSuccessModal(false)
        }, 3000)
      },
      errorNotification: (err) => {
        setIsDelete(false)

        return {
          message: 'Не удалось удалить пользователя',
          type: 'error',
        }
      },
    })
  }

  return (
    <section>


      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '20px'
        }}
      >
        <PageTitle text={'Пользователи'}/>
        <BaseAddButton
          text={'Добавить пользователя'}
          onClick={() => {
            setIsCreateNewUser(true)
          }}
        />
      </div>


      <Table
        style={{ marginTop: '30px' }}
        dataSource={data?.data}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />

      <ConfirmDeleteModal
        isOn={isDelete}
        isLoading={isLoading}
        off={() => {
          setIsDelete(false)
          setCLickedUserId(0)
        }}
        handleOk={handleDeleteUser}
        title={'Удалить пользователя?'}
      />

      <UpdateUser
        isOpen={isUpdateUser}
        off={() => {
          setIsUpdateUser(false)
          setCLickedUserId(0)
          setClickedUserData(undefined)
        }}
        user={clickedUserData}
        refetch={refetch}
      />

      {isCreateNewUser &&
        <CreateNewUser
          isOpen={isCreateNewUser}
          off={() => {
            setIsCreateNewUser(false)
          }}
          refetch={refetch}
        />
      }

      {isSuccessModal &&
        <SuccessModal
          text={'Пользователь удален'}
        />
      }

    </section>
  )
}
