import {Table, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {useCustom} from "@refinedev/core";
import {API_URL} from "../../../constants/url";
import moment from "moment/moment";

const {Title, Text} = Typography

export const UserProjectsTable = () => {
  const navigate = useNavigate()
  const localUserId = localStorage.getItem('userId')

  const { data } = useCustom<any>({
    url: `${API_URL}/project/by_user/${JSON.parse(localUserId as string)}`,
    method: 'get',
  })

  const columns = [
    {
      title: 'Название',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/projects/${record.id}`)}
          >
            {record?.name}
          </Text>
        )
      }
    },
    {
      title: 'Описание',
      render: (record: any) => {
        return (
          <div
            style={{
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/projects/${record.id}`)}
            dangerouslySetInnerHTML={{ __html: `${record.description.split(' ').slice(0, 10).join(' ')} ${record.description.split(' ').length > 10 ? '...' : ''}`}}
          >
          </div>
        )
      }
    },
    {
      title: 'Дата начала проекта',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/projects/${record.id}`)}
          >
            {moment(record.created_at).calendar('lll')}
          </Text>
        )
      }
    },
    {
      title: 'Руководитель проекта',
      render: (record: any) => {
        return (
          <Text
            style={{
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/projects/${record.id}`)}
          >
            {record.manager}
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
              gap: '5px'
            }}
            onClick={() => navigate(`/projects/${record.id}`)}
          >
            {record.employees.map((el: any) => <Text style={{whiteSpace: 'pre-line'}}>{el}</Text>)}
          </div>
        )
      }
    },
  ]

  return (
    <>
      <Table
        style={{ marginTop: '24px' }}
        dataSource={data?.data}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />
    </>
  )
}
