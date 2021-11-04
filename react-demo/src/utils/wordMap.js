const TIP_MAP = {
  CONFIRM_DELETE: '确定删除吗？',
  CONFIRM_AUDIT: '确定要提交审核吗？',
  CONFIRM_CANCEL: '确定要撤销吗？',
  CONFIRM_PUBLISH: '确定要发布吗？'
}

const ROLE_MAP = {
  1: 'superAdmin',
  2: 'regionAdmin',
  3: 'editor',
  superAdmin: 1,
  regionAdmin: 2,
  editor: 3
}

const AUDIT_STATE = {
  0: '未审核',
  1: '审核中',
  2: '审核通过',
  3: '审核失败',
  审核失败: 3,
  审核通过: 2,
  审核中: 1,
  未审核: 0
}

const PUBLISH_STATE = {
  0: '未发布',
  1: '待发布',
  2: '发布成功',
  3: '已下线',
  已下线: 3,
  发布成功: 2,
  待发布: 1,
  未发布: 0
}

export default {
  TIP_MAP,
  ROLE_MAP,
  AUDIT_STATE,
  PUBLISH_STATE
}
