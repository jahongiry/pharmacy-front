import {useCustom} from "@refinedev/core";
import {API_URL} from "../../constants/url";
import {Card, Pagination, Typography} from "antd";
import {useContext, useState} from "react";
import {CreateNewProjectModal} from "./modals/CreateNewProjectModal";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthProvider";
import {PageTitle} from "../../components/ui/PageTitle/PageTitle";
import {BaseAddButton} from "../../components/ui/BaseAddButton/BaseAddButton";
import projectStyle from './project.module.css'

moment.locale('ru')

const {Title} = Typography

export const Projects = () => {
  const navigate = useNavigate()
  const { userData } = useContext(AuthContext);

  const localUserId = localStorage.getItem('userId')

  const [isCreateProject, setIsCreateProject] = useState(false)

  const [page, setPage] = useState(1)

  const { data, refetch, isLoading } = useCustom({
    url: userData?.is_superuser ? `${API_URL}/project/get_projects` : `${API_URL}/project/by_user/${JSON.parse(localUserId as string)}`,
    method: 'get',
  })

  const isCanCreateProject = data?.data
    ?  userData?.is_superuser || userData?.is_project_manager
    :  false

  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <PageTitle text={'Проекты'}/>
        {isCanCreateProject &&
          <BaseAddButton
            text={'Добавить проект'}
            onClick={() => {
              setIsCreateProject(true)
            }}
          />
        }
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: 'wrap',
          marginTop: '20px',
          gap: '30px'
        }}
      >
        {data?.data.length
          ? data?.data?.slice(((page * 6) - 6), (page * 6)).map((el: any) => {
          return (
            <Card
              onClick={() => navigate(`${el.id}`)}
              cover={
                <p
                  style={{
                    background: 'hsla(209, 83%, 63%, 1)',
                    padding: '16px 24px',
                    color: 'white',
                    borderRadius: '5px 5px 0 0',
                    fontSize: '24px',
                    height: '70px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  className={projectStyle.twoLine}
                >
                  {el.name}
                </p>
              }
              style={{
                borderRadius: '5px',
                maxWidth: '32%',
                width: '100%',
                cursor: 'pointer',
                boxShadow: '0px 2px 4px 0px hsla(0, 0%, 0%, 0.15)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}
                className={projectStyle.description}
                dangerouslySetInnerHTML={{ __html: `${el.description.split(' ').slice(0, 20).join(' ')} ${el.description.split(' ').length > 20 ? '...' : ''}`}}
              />
              <div
                style={{
                  display: 'flex',
                  gap: '80px',
                  marginTop: '16px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <p
                    className={projectStyle.time}
                  >
                    Начало:
                  </p>
                  <p
                    className={projectStyle.description}
                  >
                    {moment(el.created_at).calendar('lll')}
                  </p>
                </div>
                {el.finished_at &&
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <p
                      className={projectStyle.time}
                    >
                      Окончание:
                    </p>
                    <p
                      className={projectStyle.description}
                    >
                      {moment(el.finished_at).calendar('lll')}
                    </p>
                  </div>
                }

              </div>
              {el.employees.length > 0 &&
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '100px',
                    marginTop: '16px'
                  }}
                >
                  <p
                    className={projectStyle.time}
                  >
                    Руководитель:
                  </p>
                  <p
                    className={projectStyle.description}
                    style={{
                      marginLeft: '-20px'
                    }}
                  >
                    {el.manager}
                  </p>
                </div>
              }

              {el.employees.length > 0 &&
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '110px',
                    marginTop: '16px'
                  }}
                >
                  <p
                    className={projectStyle.time}
                  >
                    Сотрудники:
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      marginLeft: '-20px'
                    }}
                  >
                    {el.employees.map((item: string, i: number) => {
                      return (
                        <p
                          className={projectStyle.description}
                          style={{marginRight: '4px'}}
                        >
                          {`${item}${el.employees.length - 1 !== i ? ', ' : ''} `}
                        </p>
                      )
                    })}
                  </div>
                </div>
              }
            </Card>
          )
        })
          : <Title level={4}>{!isLoading && 'Нет проектов'}</Title>}
      </div>
      {data?.data.length > 0 &&
        <div
          style={{
            marginTop: '20px'
          }}
        >
          <Pagination
            defaultCurrent={1}
            total={data?.data ? Number(`${Math.ceil(data?.data.length / 6)}0`) : 0}
            current={page}
            onChange={(page) => setPage(page)}
          />
        </div>
      }

      {isCreateProject &&
        <CreateNewProjectModal
          isOn={isCreateProject}
          handleCancel={() => {
            setIsCreateProject(false)
          }}
          refetch={refetch}
        />
      }

    </section>
  )
}
