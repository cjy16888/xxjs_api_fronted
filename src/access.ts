/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: InitialState  | undefined) {
  //根据initialState进行权限判断，获取的是当前用户的信息，全局变量
  const { loginUser } = initialState ?? {};
  return {
    canUser: loginUser,
    //判断当前用户是否为管理员
    canAdmin: loginUser?.userRole === 'admin',
  };
}
