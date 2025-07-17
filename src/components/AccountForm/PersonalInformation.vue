<script lang="ts" setup>
const personFrom = ref({
  name: '',
})
</script>

<template>
  <div>
    <Elfrom v-model="personFrom">
      <ELrow>
        <Elcol :span="24">
          <Elformitem label="昵称" prop="name">
            <Elinput v-model="personFrom.name" clearable placeholder="请输入" />
          </Elformitem>
        </Elcol>
      </ELrow>
    </Elfrom>
  </div>
</template>

<style scoped>

</style>
