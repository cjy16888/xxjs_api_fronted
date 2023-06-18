import { addRule,removeRule,updateRule } from '@/services/ant-design-pro/api';
import {
  addInterfaceInfoUsingPOST, deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET, offlineInterfaceInfoUsingPOST, updateInterfaceInfoUsingPOST
} from "@/services/xxjs_backend/interfaceInfoController";
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType,ProColumns,ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
FooterToolbar,
ModalForm,
PageContainer,
ProDescriptions,
ProFormText,
ProFormTextArea,
ProTable
} from '@ant-design/pro-components';
import { FormattedMessage,useIntl } from '@umijs/max';
import { Button,Drawer,message } from 'antd';
import { SortOrder } from "antd/lib/table/interface";
import React,{ useRef,useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import CreateModal from "@/pages/InterfaceInfo/components/CreateModal";
import UpdateModal from "@/pages/InterfaceInfo/components/UpdateModal";

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      //调用我们自己的接口
      await addInterfaceInfoUsingPOST({
        //这个...fields是什么意思？就是把fields里面的所有属性都展开了，进行传递
        //就是下面的 columns 里面的所有的属性
        ...fields,
      });
      hide();
      message.success('创建成功');
      handleModalVisible(false);
      return true;
    } catch (error: any) {
      hide();
      message.error('创建失败，' + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields:  API.InterfaceInfo) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateInterfaceInfoUsingPOST({
        id: currentRow.id,
        ...fields
      });
      hide();
      message.success('操作成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };


  /**
   * 下线接口
   *
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('删除成功');
      //刷新列表
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  //api 改成我们自己的接口信息
  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: "id",
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: "接口名称",
      //对应的接口字段
      dataIndex: 'name',
      //渲染的组件
      valueType: 'text',
    },
    {
      title: "描述",
      dataIndex: 'description',
      //富文本编辑器，内容比较多的时候可以用这个
      valueType: 'textarea',
    },
    {
      title: "请求方法",
      dataIndex: 'method',
      valueType: 'textarea',
    },
    {
      title: "url",
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: "请求头",
      dataIndex: 'requestHeader',
      valueType: 'textarea',
    },
    {
      title: "响应头",
      dataIndex: 'responseHeader',
      valueType: 'textarea',
    },
    {
      title: "状态",
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing'
        }
      },
    },
    {
      title: "创建时间",
      dataIndex: 'createTime',
      valueType: 'dateTime',
      //在表单中隐藏
      hideInForm: true,
    },
    {
      title: "更新时间",
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <Button
          type="text"
          key="config"
          danger
          onClick={() => {
            handleRemove(record);
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          //新建按钮
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              //弹出新建的弹窗
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        //通过下面的 request 进行调用后端的接口，然后返回数据
        //注意，使用我们的自己的接口，但是返回的数据格式必须是 antd pro 要求的格式
        //所以我们需要进行一下转换
        request={async (
          params,
          sort: Record<string, SortOrder>,
          filter: Record<string, (string | number)[] | null>,
        ) => {
          //这里的 listInterfaceInfoByPageUsingGET 是我们自己的接口
          //请求获取数据
          const res = await listInterfaceInfoByPageUsingGET({
            ...params,
          });
          //将数据转换成 antd pro 要求的格式
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total,
            };
          }else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        //修改下面的这个 columns 就是页面显示的表格的字段信息，要就是我们后端返回的字段信息
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      {/*<ModalForm*/}
      {/*  title={intl.formatMessage({*/}
      {/*    id: 'pages.searchTable.createForm.newRule',*/}
      {/*    defaultMessage: 'New rule',*/}
      {/*  })}*/}
      {/*  width="400px"*/}
      {/*  open={createModalOpen}*/}
      {/*  onOpenChange={handleModalOpen}*/}
      {/*  onFinish={async (value) => {*/}
      {/*    const success = await handleAdd(value as API.RuleListItem);*/}
      {/*    if (success) {*/}
      {/*      handleModalOpen(false);*/}
      {/*      if (actionRef.current) {*/}
      {/*        actionRef.current.reload();*/}
      {/*      }*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <ProFormText*/}
      {/*    rules={[*/}
      {/*      {*/}
      {/*        required: true,*/}
      {/*        message: (*/}
      {/*          <FormattedMessage*/}
      {/*            id="pages.searchTable.ruleName"*/}
      {/*            defaultMessage="Rule name is required"*/}
      {/*          />*/}
      {/*        ),*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*    width="md"*/}
      {/*    name="name"*/}
      {/*  />*/}
      {/*  <ProFormTextArea width="md" name="desc" />*/}
      {/*</ModalForm>*/}
      {/*下面的 columns 是我们进行传递的，列表数据，点击修改的时候，进行将当前的数据传递到弹窗中*/}
      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.InterfaceInfo>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.InterfaceInfo>[]}
          />
        )}
      </Drawer>
      {/*创建对应的模态框的数据，封装起来（就是添加数据的弹窗）*/}
      <CreateModal
        columns={columns}
        onCancel={() => {
          handleModalVisible(false);
        }}
        onSubmit={(values) => {
          handleAdd(values);
        }}
        visible={createModalVisible}
      />
    </PageContainer>
  );
};

export default TableList;
