import s from './index.module.css'
import moment from "moment";
interface IProps {
  data: any
}

export const AboutProject = ({data}: IProps) => {
  return (
    <div
      className={s.wrapper}
    >
      <div
        className={s.box}
      >
        <p className={s.description}>Описание:</p>
        <div
          dangerouslySetInnerHTML={{ __html: data?.data?.description?.description }}
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
            Руководитель проекта:
          </p>
          <p
            className={s.content}
            style={{
              marginLeft: '23px'
            }}
          >
            {data?.data?.working_group?.manager?.username ? data?.data?.working_group?.manager?.username : 'Не указан'}
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
            {moment(data?.data?.description?.created_at).calendar('l')} {data?.data?.description?.finished_at ? `- ${moment(data?.data?.description?.finished_at).calendar('l')}` : ''}
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
          {data?.data?.working_group?.employees?.map((el: {username: string}, i: number) => `${el.username}${i !== data?.data?.working_group?.employees.length - 1 ? ', ' : ''}`)}
        </p>
      </div>

      {data?.data?.substances?.length > 0 &&
        <div
          className={s.box}
        >
          <p className={s.description}>Используемые активные фармацевтические субстанции:</p>
          <p
            className={s.content}
          >
            {data?.data?.substances?.map((el: {name: string}, i: number) => `${el.name}${i !== data?.data?.substances.length - 1 ? ', ' : ''}`)}
          </p>
        </div>
      }

      <div
        className={s.grid}
      >
        <div
          style={{
            display: "flex",
            alignItems: 'center'
          }}
        >
          <p className={s.description}>
            Торговое наименование разрабатываемого лекарственного препарат:
          </p>
          <p
            className={s.content}
            style={{
              marginLeft: '23px'
            }}
          >
            {data?.data?.description?.trade_name ? data?.data?.description?.trade_name : 'Не указано'}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: 'center'
          }}
        >
          <p className={s.description}>Международное непатентованное наименование:</p>
          <p
            className={s.content}
            style={{
              marginLeft: '16px'
            }}
          >
            {data?.data?.description?.international_nonproprietary_name ? data?.data?.description?.international_nonproprietary_name : 'Не указано'}
          </p>
        </div>
      </div>

      <div
        className={s.grid}
      >
        <div
          style={{
            display: "flex",
            alignItems: 'center'
          }}
        >
          <p className={s.description}>
            Химическое наименование:
          </p>
          <p
            className={s.content}
            style={{
              marginLeft: '23px'
            }}
          >
            {data?.data?.description?.chemical_name ? data?.data?.description?.chemical_name : 'Не указано'}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: 'center'
          }}
        >
          <p className={s.description}>Тип:</p>
          <p
            className={s.content}
            style={{
              marginLeft: '16px'
            }}
          >
            {data?.data?.description?.type ? data?.data?.description?.type : 'Не указано'}
          </p>
        </div>
      </div>

      <div
        className={s.grid}
      >
        <div
          style={{
            display: "flex",
            alignItems: 'center'
          }}
        >
          <p className={s.description}>
            Фармакотерапевтическая группа:
          </p>
          <p
            className={s.content}
            style={{
              marginLeft: '23px'
            }}
          >
            {data?.data?.description?.pharmacotherapeutic_group ? data?.data?.description?.pharmacotherapeutic_group : 'Не указано'}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: 'center'
          }}
        >
          <p className={s.description}>Аналоги:</p>
          <p
            className={s.content}
            style={{
              marginLeft: '16px'
            }}
          >
            {data?.data?.analogues.length ? data?.data?.analogues.map((el: {name: string}, i: number) => `${el.name}${i !== data?.data?.analogues.length - 1 ? ', ' : ''}`) : 'Не указано'}
          </p>
        </div>
      </div>

      {data?.data?.properties.length > 0 && data?.data?.properties.map((el: {additional_column: string; additional_value: string; id: number}) => {
        return (
          <div
            className={s.box}
          >
            <p className={s.description}>{el.additional_column}</p>
            <p className={s.content}>{el.additional_value}</p>
          </div>
        )
      })}




    </div>
  )
}
