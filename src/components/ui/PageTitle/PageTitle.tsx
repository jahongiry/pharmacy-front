import arrow from '../../../assets/icons/arrow.svg'

interface IProps {
  text: string
  link?: string
}

export const PageTitle = ({text, link}: IProps) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: 'center'
      }}
    >
      {link &&
        <a
          href={link}
          style={{
            marginRight: '15px',
            marginTop: '-12px',
            cursor: 'pointer'
          }}
        >
          <img src={arrow} alt={'arrow'}/>
        </a>
      }

      <h1
        style={{
          fontWeight: '700',
          fontSize: '34px',
          lineHeight: '36px',
          color: 'hsla(0, 0%, 0%, 1)'
        }}
      >
        {text}
      </h1>

    </div>

  )
}
