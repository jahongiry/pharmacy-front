import moment from "moment";
import s from "../../../ProjectDetail/components/AboutProject/index.module.css";
import {useCustom} from "@refinedev/core";
import {API_URL} from "../../../../constants/url";
import {useParams} from "react-router-dom";

interface IProps {
  data: any
}
export const AboutStage = ({data}: IProps) => {
  const {projectId, stageId} = useParams()

  const { data: dataDepend } = useCustom({
    url: `${API_URL}/project/${projectId}/stage/${stageId}/dependencies`,
    method: 'get',
  })

  return (
    <div
      className={s.wrapper}
    >
      <div
        className={s.box}
      >
        <p className={s.description}>Описание:</p>
        <div
          dangerouslySetInnerHTML={{ __html: data?.data?.stage?.description ? data?.data?.stage.description : 'Не указано' }}
          className={s.content}
        />
      </div>

      <div
        className={s.grid}
      >
        <div
          style={{
            display: "flex"
          }}
        >
          <p className={s.description}>
            Статус:
          </p>
          <p
            className={s.content}
            style={{
              marginLeft: '23px'
            }}
          >
            {data?.data?.status ? data?.data.status : 'Не указано'}
          </p>
        </div>

        <div
          style={{
            display: "flex"
          }}
        >
          <p className={s.description}>Сроки:</p>
          <p
            className={s.content}
            style={{
              marginLeft: '10px'
            }}
          >
            {data?.data?.stage.begin_at ? moment(data?.data?.stage.begin_at).calendar('l') : 'Не указано'} {data?.data?.stage.end_at ? `- ${moment(data?.data?.stage.end_at).calendar('l')}` : ''}
          </p>
        </div>
      </div>

      <div
        className={s.box}
      >
        <p className={s.description}>Сотрудники:</p>
        <p
          className={s.content}
        >
          {data?.data?.performers.length ? data?.data?.performers.map((el: {username: string}, i: number) => `${el.username}${i !== data?.data?.performers.length - 1 ? ', ' : ''}`) : 'Не указаны'}
        </p>
      </div>

      <div
        className={s.box}
      >
        <p className={s.description}>Этапы-предшественники:</p>
        <p
          className={s.content}
        >
          {dataDepend?.data?.predecessors.length ? dataDepend?.data?.predecessors.map((el: {name: string}, i: number) => `${el.name}${i !== dataDepend?.data?.predecessors.length - 1 ? ', ' : ''}`) : 'Не указаны'}
        </p>
      </div>

      <div
        className={s.box}
      >
        <p className={s.description}>Этапы-последователи:</p>
        <p
          className={s.content}
        >
          {dataDepend?.data?.followers.length ? dataDepend?.data?.followers.map((el: {name: string}, i: number) => `${el.name}${i !== dataDepend?.data?.followers.length - 1 ? ', ' : ''}`) : 'Не указаны'}
        </p>
      </div>

    </div>
  )
}

