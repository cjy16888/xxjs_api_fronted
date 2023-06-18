import type {ProColumns, ProFormInstance} from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Modal } from 'antd';
import React, {createRef, useEffect, useRef} from 'react';

export type Props = {
  values: API.InterfaceInfo;
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  visible: boolean;
};

const UpdateModal: React.FC<Props> = (props) => {
  const { values, visible, columns, onCancel, onSubmit } = props;

  //这里的visible就是我们在父组件中传递的visible，根据这个值来判断是否显示弹窗
  const formRef = useRef<ProFormInstance>();

  //设置一个监听，当visible变化时，就会执行这个函数
  //不然的话，这里默认只能初始化一次，后面就不会再变化了，那么我们只能更改一条数据，一直是那个 id，更换不了
  //这是 React 的一个特性，当我们需要监听某个值的变化时，就需要使用 useEffect
  useEffect(() => {
    //每一次进行点击修改的时候，都会重新设置一下表单的值
    if (formRef) {
      formRef.current?.setFieldsValue(values);
    }
  }, [values])

  return (
    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <ProTable
        type="form"
        formRef={formRef}
        columns={columns}
        onSubmit={async (value) => {
          onSubmit?.(value);
        }}
      />
    </Modal>
  );
};
export default UpdateModal;
