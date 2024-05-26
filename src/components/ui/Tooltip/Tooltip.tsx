import s from './tooltip.module.css'
import {CSSProperties} from "react";

interface IProps {
  text: string
  directionTriangle: string
  style?:CSSProperties
}
export const Tooltip = ({text, directionTriangle, style}: IProps) => {

  const trianglePosition =
    directionTriangle === 'right'
      ? { top: '50%', right: '-3%' }
      : directionTriangle === 'left'
        ? {
          top: '50%',
          left: '-7px',
          transform: 'translateY(-50%) rotate(90deg)',
        }
        : directionTriangle === 'bottom'
          ? {
            top: '103%',
            left: '50%',
            transform: 'translateY(-50%) rotate(0deg)',
          }
          : {
            top: '-5%',
            left: '90%',
            transform: 'translateY(-50%) rotate(180deg)',
          }

  return (
    <div className={s.wrapper} style={style}>
      <div className={s.tooltipEl}>
        <p>{text}</p>
        <div className={s.triangle} style={trianglePosition}/>
      </div>
    </div>
  )
}
