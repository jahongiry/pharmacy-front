import style from './index.module.css'

interface IProps {
  links: {link: string; name: string;}[]
}

export const BreadCrumbs = ({links}: IProps) => {
  return (
    <div
      className={style.block}
    >
      {links.map((el, index) => {
        return (
          <a
            href={el.link}
            className={style.linkItem}
          >
            {` ${el.name}`}{' '} <span>{index !== links.length - 1 && '/ '}</span>
          </a>
        )
      })}

    </div>
  )
}
