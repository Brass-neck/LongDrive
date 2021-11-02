import { Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

/**
 * confirm确认框
 */
const { confirm } = Modal
export const showConfirm = (title, cb) => {
  confirm({
    title,
    cancelText: '取消',
    okText: '确定',
    icon: <ExclamationCircleOutlined />,
    onOk() {
      cb && cb()
    }
  })
}
