import {PageTitle} from "../../components/ui/PageTitle/PageTitle";
import {useCustom} from "@refinedev/core";
import {API_URL} from "../../constants/url";
import {Card, Pagination, Typography} from "antd";
import projectStyle from "../Projects/project.module.css";
import moment from "moment";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const {Title} = Typography

export const MyTasks = () => {
  const navigate = useNavigate()

  const [page, setPage] = useState(1)

  const { data, isLoading } = useCustom<any>({
    url: `${API_URL}/task/by_user`,
    method: 'get',
  })

  return (
    <section>
      <PageTitle text={'Мои задачи'}/>

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
                onClick={() => navigate(`/task/${el.id}/${el.project_id}/${el.stage_id}`)}
                cover={
                  <p
                    style={{
                      background: 'hsla(137, 35%, 58%, 1)',
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
                  maxWidth: '30%',
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
                    Проект:
                  </p>
                  <p
                    className={projectStyle.description}
                  >
                    {el.project}
                  </p>

                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '115px',
                    marginTop: '16px'
                  }}
                >
                  <p
                    className={projectStyle.time}
                  >
                    Этап:
                  </p>
                  <p
                    className={projectStyle.description}
                  >
                    {el.stage}
                  </p>

                </div>

              </Card>
            )
          })
          : <Title level={4}>{!isLoading && 'Нет задач'}</Title>}
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

    </section>
  )
}
