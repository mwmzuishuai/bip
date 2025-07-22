<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'

const personFrom = ref({
  name: '',
  phone: '',
  email: '',
})
const imageUrl = ref('')

function handleAvatarSuccess(response, uploadFile) {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

function beforeAvatarUpload(rawFile) {
  if (rawFile.type !== 'image/jpeg') {
    return false
  }
  else if (rawFile.size / 1024 / 1024 > 2) {
    return false
  }
  return true
}
</script>

<template>
  <div class="w-full flex-col-stretch-center">
    <ElForm :model="personFrom" label-width="80px" size="default">
      <ElRow>
        <ElCol :span="24" class="text-center" style="margin-bottom: 10px;">
          <ElFormItem label="头像" prop="avatar">
            <el-upload
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              class="avatar-uploader"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </ElFormItem>
        </ElCol>
        <ElCol :span="24">
          <ElFormItem label="昵称" prop="name">
            <ElInput v-model="personFrom.name" clearable placeholder="请输入" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="24">
          <ElFormItem label="手机号" prop="name">
            <ElInput v-model="personFrom.phone" clearable placeholder="请输入" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="24">
          <ElFormItem label="邮箱" prop="name">
            <ElInput v-model="personFrom.email" clearable placeholder="请输入" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="24">
          <ElFormItem label="手机号" prop="name">
            <ElInput v-model="personFrom.phone" clearable placeholder="请输入" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 108px;
  height: 108px;
  display: block;
}

:deep() {
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 108px;
    height: 108px;
    text-align: center;
  }
}
</style>
