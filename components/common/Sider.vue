<template>
  <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
    <a-menu-item key="1">
      <nuxt-link :to="`/db`">
        <a-icon type="user" />
        <span>Database Config</span>
      </nuxt-link>
    </a-menu-item>
  </a-menu>
</template>
