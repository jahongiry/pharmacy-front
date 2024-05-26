import { Typography } from 'antd'
import classNames from 'classnames/bind'
import { CSSProperties } from 'react'


import styles from './customTitle.module.css'

interface CustomTitleProps {
  collapsed?: boolean
  style?: CSSProperties
  text: string
}

const cx = classNames.bind(styles)

const CustomTitle = ({ collapsed, style, text }: CustomTitleProps) => {
  return (
    <section className={cx('content')} style={{ ...style }}>
      {!collapsed && (
        <Typography.Text strong={true} style={{ marginLeft: 10, fontSize: 15 }}>
          {text}
        </Typography.Text>
      )}
    </section>
  )
}

export default CustomTitle
