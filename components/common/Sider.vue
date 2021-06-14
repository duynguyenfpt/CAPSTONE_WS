<template>
  <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
    <a-menu-item key="1">
      <nuxt-link :to="`/db`">
        <a-icon type="user" />
        <span>Database Config</span>
      </nuxt-link>
    </a-menu-item>
    <a-menu-item key="2">
      <nuxt-link :to="`/table`">
        <a-icon type="user" />
        <span>Table Manageman</span>
      </nuxt-link>
    </a-menu-item>
  </a-menu>
</template>
