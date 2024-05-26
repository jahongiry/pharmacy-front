import {Dispatch, SetStateAction} from "react";
import {Checkbox} from "antd";

export const ModalHelpers = () => {
  const checkboxLayout = (text: string, state: boolean, setState: Dispatch<SetStateAction<boolean>>) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <Checkbox
          checked={state}
          onChange={(e) => setState(!state)}
        />
        {text}
      </div>
    )
  }

  return {checkboxLayout}
}
