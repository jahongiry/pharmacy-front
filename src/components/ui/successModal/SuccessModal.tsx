import style from './success.module.css'
import ok from '../../../assets/icons/OK.svg'

interface IProps {
  text: string
}
export const SuccessModal = ({text}: IProps) => {
  return (
    <div
      className={style.modal}
    >
      <img src={ok} alt={'image'}/>
      <p
        className={style.text}
      >
        {text}
      </p>

    </div>
  )
}
