import {useCustom} from "@refinedev/core";
import {API_URL} from "../../../constants/url";
import {Table, Typography} from "antd";
import {useNavigate} from "react-router-dom";

const { Text} = Typography

export const UserTasksTable = () => {
  const navigate = useNavigate()

  const { data: dataTasks } = useCustom<any>({
    url: `${API_URL}/task/by_user`,
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
            onClick={() => navigate(`/task/${record.id}/${record.project_id}`)}
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
            onClick={() => navigate(`/task/${record.id}/${record.project_id}`)}
          >
            {record.description.split(' ').slice(0, 10).join(' ')} {record.description.split(' ').length > 10 ? '...' : ''}
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
            onClick={() => navigate(`/task/${record.id}/${record.project_id}`)}
          >
            {record.status}
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
            onClick={() => navigate(`/task/${record.id}/${record.project_id}`)}
          >
            {record.employee}
          </Text>
        )
      }
    },
  ]

  return (
    <div
      style={{
        marginTop: '20px'
      }}
    >

      <Table
        style={{ marginTop: '30px' }}
        dataSource={dataTasks?.data}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />
    </div>

  )
}
