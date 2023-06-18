import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Modal } from 'antd';
import React from 'react';

export type Props = {
  //获取columns，就是之前我们获取的表单的配置，那些字段
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  visible: boolean;
};

const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, onCancel, onSubmit } = props;

  //这里的visible就是我们在父组件中传递的visible，根据这个值来判断是否显示弹窗
  return (
    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      {/*直接显示的表单选项*/}
      {/*这个ProTable已经把很多东西进行封装了起来，直接使用就行*/}
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (value) => {
          onSubmit?.(value);
        }}
      />
    </Modal>
  );
};
export default CreateModal;
