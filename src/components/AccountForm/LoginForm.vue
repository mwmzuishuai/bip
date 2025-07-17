<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import * as z from 'zod'
import api from '@/api/modules/user'
import useUserStore from '@/store/modules/user'
import { FormControl, FormField, FormItem, FormMessage } from '@/ui/shadcn/ui/form'

defineOptions({
  name: 'LoginForm',
})

const props = defineProps<{
  account?: string
}>()

const emits = defineEmits<{
  onLogin: [account?: string]
  onRegister: [account?: string]
  onResetPassword: [account?: string]
}>()

const userStore = useUserStore()

const title = import.meta.env.VITE_APP_TITLE
const loading = ref(false)

// 登录方式，default 账号密码登录，qrcode 扫码登录
const type = ref<'default' | 'qrcode'>('default')

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    username: z.string().min(1, '请输入用户名'),
    password: z.string().min(1, '请输入密码'),
    captcha: z.string().min(1, '请输入验证码'),
    remember: z.boolean(),
  })),
  initialValues: {
    username: props.account ?? localStorage.getItem('login_account') ?? '',
    password: '',
    captcha: '',
    remember: !!localStorage.getItem('login_account'),
  },
})
const onSubmit = form.handleSubmit((values) => {
  loading.value = true
  userStore.login(values).then(() => {
    if (values.remember) {
      localStorage.setItem('login_account', values.username)
    }
    else {
      localStorage.removeItem('login_account')
    }
    emits('onLogin', values.username)
  }).finally(() => {
    loading.value = false
  }).catch(() => {
    onRefreshCode()
  })
})
// 验证码生成
const codeUrl = ref('')
function onRefreshCode() {
  api.getCaptcha().then((res) => {
    // base 64
    codeUrl.value = `data:image/png;base64,${res.data.image}`
  })
}
onMounted(() => {
  onRefreshCode()
})
// function testAccount(account: string) {
//   form.setFieldValue('account', account)
//   form.setFieldValue('password', '123456')
//   onSubmit()
// }
</script>

<template>
  <div class="min-h-500px w-full flex-col-stretch-center p-12">
    <div class="mb-6 space-y-2">
      <h3 class="text-4xl color-[var(--el-text-color-primary)] font-bold">
        欢迎使用 👋🏻
      </h3>
      <p class="text-sm text-muted-foreground lg:text-base">
        {{ title }}能源管理系统
      </p>
    </div>
    <div class="mb-4">
      <FaTabs
        v-model="type" :list="[
          { label: '账号密码登录', value: 'default' },
        // { label: '扫码登录', value: 'qrcode' },
        ]" class="inline-flex"
      />
    </div>
    <div v-show="type === 'default'">
      <form @submit="onSubmit">
        <FormField v-slot="{ componentField, errors }" name="username">
          <FormItem class="relative pb-6 space-y-0">
            <FormControl>
              <FaInput
                :class="errors.length && 'border-destructive'" class="w-full" placeholder="请输入用户名" type="text"
                v-bind="componentField"
              />
            </FormControl>
            <Transition
              enter-active-class="transition-opacity" enter-from-class="opacity-0"
              leave-active-class="transition-opacity" leave-to-class="opacity-0"
            >
              <FormMessage class="absolute bottom-1 text-xs" />
            </Transition>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField, errors }" name="password">
          <FormItem class="relative pb-6 space-y-0">
            <FormControl>
              <FaInput
                :class="errors.length && 'border-destructive'" class="w-full" placeholder="请输入密码" type="password"
                v-bind="componentField"
              />
            </FormControl>
            <Transition
              enter-active-class="transition-opacity" enter-from-class="opacity-0"
              leave-active-class="transition-opacity" leave-to-class="opacity-0"
            >
              <FormMessage class="absolute bottom-1 text-xs" />
            </Transition>
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField, errors }" name="captcha">
          <FormItem class="relative pb-6 space-y-0">
            <FormControl>
              <div class="flex-center-between">
                <FaInput
                  :class="errors.length && 'border-destructive'" class="w-1xl"
                  placeholder="请输入验证码" v-bind="componentField"
                />
                <!-- 验证图片 -->
                <img :src="codeUrl" alt="点击刷新" class="h-[40px] w-[100px]" title="点击刷新" @click="onRefreshCode">
              </div>
            </FormControl>
            <Transition
              enter-active-class="transition-opacity" enter-from-class="opacity-0"
              leave-active-class="transition-opacity" leave-to-class="opacity-0"
            >
              <FormMessage class="absolute bottom-1 text-xs" />
            </Transition>
          </FormItem>
        </FormField>
        <div class="mb-4 flex-center-between">
          <div class="flex-center-start">
            <FormField v-slot="{ componentField }" name="remember" type="checkbox">
              <FormItem>
                <FormControl>
                  <FaCheckbox v-bind="componentField">
                    记住我
                  </FaCheckbox>
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <FaButton
            class="h-auto p-0" type="button" variant="link"
            @click="emits('onResetPassword', form.values.username)"
          >
            忘记密码了?
          </FaButton>
        </div>
        <FaButton :loading="loading" class="w-full" size="lg" type="submit">
          登录
        </FaButton>
      </form>
      <div class="mt-4 text-center -mb-4" />
    </div>
    <div v-show="type === 'qrcode'">
      <div class="flex-col-center">
        <img class="h-[250px] w-[250px]" src="https://s2.loli.net/2024/04/26/GsahtuIZ9XOg5jr.png">
        <div class="mt-2 text-sm text-secondary-foreground op-50">
          请使用微信扫码登录
        </div>
      </div>
    </div>
  </div>
</template>
