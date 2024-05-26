import arrow from '../../../assets/icons/arrowDown.svg'
import s from './arrow.module.css'
import {CSSProperties, ReactNode} from "react";

interface IProps {
  isOn: boolean
  title: string
  content: ReactNode
  button?: ReactNode
  switchContent: () => void
  styles?: CSSProperties
}

export const ArrowComponent = ({isOn, title, content, switchContent, styles, button}: IProps) => {
  return (
    <div
      style={{
        width: '100%',
        ...styles
      }}
    >
      <div
        className={s.wrapper}
      >
        <div
          className={s.box}
          onClick={switchContent}
        >
          <img
            src={arrow}
            alt={'arrow'}
            style={{
              transform: !isOn ? 'rotate(0deg)' : 'rotate(180deg)',
              marginTop: '10px'
            }}
          />
          <p
            className={s.title}
          >
            {title}
          </p>
        </div>

        {button && button}
      </div>

      <div
        style={{
          marginTop: '20px'
        }}
      >
        {isOn && content}
      </div>
    </div>

  )
}
