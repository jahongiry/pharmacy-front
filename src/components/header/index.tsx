import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import {useCustom} from "@refinedev/core";
import {
  Layout as AntdLayout,
} from "antd";
import React, {useContext, useEffect} from "react";
import {API_URL} from "../../constants/url";
import {AuthContext} from "../../context/AuthProvider";
import {NavigateButtons} from "./compoenents/NavigateButtons";
import {UserDropDown} from "./compoenents/UserDropDown/UserDropDown";

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const { helperSetUserData } = useContext(AuthContext);

  const { data } = useCustom<any>({
    url: `${API_URL}/auth/update_user/me`,
    method: 'get',
  })



  const headerStyles: React.CSSProperties = {
    backgroundColor: 'hsla(0, 0%, 100%, 1)',
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    height: "48px",
    background: 'hsla(0, 0%, 100%, 1)',
    boxShadow: '0px 2px 4px 0px hsla(0, 0%, 0%, 0.15)'
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  useEffect(() => {
    if(data?.data && helperSetUserData) {
      helperSetUserData(data.data)
      localStorage.setItem('isAdmin', JSON.stringify(data?.data?.is_superuser))
    }
  }, [data])

  return (
    <AntdLayout.Header style={headerStyles}>
      <NavigateButtons />
      <UserDropDown data={data} />
    </AntdLayout.Header>
  );
};
