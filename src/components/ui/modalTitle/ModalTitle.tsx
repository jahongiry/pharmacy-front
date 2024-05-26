import s from './index.module.css'

interface IProps {
  title: string
}

export const ModalTitle = ({title}: IProps) => {
  return (
    <div
      className={s.wrapper}
    >
      <p>{title}</p>
      <div className={s.line}></div>
    </div>
  )
}
