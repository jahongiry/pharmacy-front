import s from './styles.module.css'

interface IProps {
  textOk: string
  iconOk: any
  textCancel: string
  iconCancel: any
  okColor?: string
  handleClickOk: () => void
  handleClickClose: () => void
}

export const LowButtons = (
  {
    textOk,
    iconOk,
    textCancel,
    iconCancel,
    okColor = 'hsla(209, 84%, 40%, 1)',
    handleClickClose,
    handleClickOk
  }: IProps) => {
  return (
    <>
      <div className={s.line}/>
      <div className={s.buttons}>
        <button onClick={handleClickOk}>
          <img src={iconOk} alt={'iconOk'}/>
          <span style={{color: okColor}}>{textOk}</span>
        </button>
        <button  onClick={handleClickClose}>
          <img src={iconCancel} alt={'iconCancel'}/>
          <span>{textCancel}</span>
        </button>

      </div>
    </>
  )
}
