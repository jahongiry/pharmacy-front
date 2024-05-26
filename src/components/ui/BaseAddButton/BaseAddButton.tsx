import edit from '../../../assets/icons/editWhite.svg'

interface IProps {
  text: string
  onClick: () => void
  isEdit?: boolean
  icon?: any
}

export const BaseAddButton = ({text, onClick, isEdit, icon}: IProps) => {
  return (
    <button
      style={{
        background: 'hsla(209, 84%, 40%, 1)',
        height: '40px',
        minWidth: '196px',
        padding: '7px 15px',
        borderRadius: '4px',
        boxShadow: '0px 2px 0px 0px hsla(0, 0%, 0%, 0.04)',
        color: 'white',
        fontSize: '18px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        display: "flex",
        alignItems: "center",
        gap: '10px',
        justifyContent: 'center'
      }}
      onClick={onClick}
    >
      {isEdit ? <img src={icon ? icon : edit} alt={'edit'}/> : '+'}  {text}
    </button>
  )
}
