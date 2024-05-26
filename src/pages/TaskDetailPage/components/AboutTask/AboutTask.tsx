import s from "../../../ProjectDetail/components/AboutProject/index.module.css";
import moment from "moment";

interface IProps {
  data: any
}

export const AboutTask = ({data}: IProps) => {
  return (
    <div
      className={s.wrapper}
    >
      <div
        className={s.box}
      >
        <p className={s.description}>Описание:</p>
        <p
          className={s.content}
        >
          {data?.data?.task?.description ? data?.data?.task?.description  : 'Не указано'}
        </p>
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
            {data?.data?.task?.status ? data?.data?.task?.status  : 'Не указан'}
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
            {data?.data?.task.created_at ? moment(data?.data?.task.created_at).calendar('l') : 'Не указано'} {data?.data?.task?.finished_at ? `- ${moment(data?.data?.task?.finished_at).calendar('l')}` : ''}
          </p>
        </div>
      </div>

      <div
        className={s.box}
      >
        <p className={s.description}>Исполнитель:</p>
        <p
          className={s.content}
        >
          {data?.data?.task?.employee ? data?.data?.task?.employee : 'Не указан'}
        </p>
      </div>

      <div
        className={s.box}
      >
        <p className={s.description}>Связанные задачи:</p>
        <p
          className={s.content}
        >
          {data?.data?.linked.length ? data?.data?.linked.map((el: {name: string}, i: number) => `${el.name}${i !== data?.data?.linked.length - 1 ? ', ' : ''}`) : 'Не указаны'}
        </p>
      </div>
    </div>
  )
}
