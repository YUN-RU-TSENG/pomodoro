<script setup></script>

<template>
  <section class="home-add-task">
    <button class="add-task-button">
      <img
        src="https://img.icons8.com/ios-glyphs/60/000000/add--v1.png"
        alt=""
        width="22"
      />
    </button>
    <input type="text" class="add-task-input" />
    <section class="add-task-watch">
      <button class="watch">
        <img
          src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
          alt=""
          width="22"
        /></button
      ><button class="watch">
        <img
          src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
          alt=""
          width="22"
        /></button
      ><button class="watch">
        <img
          src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
          alt=""
          width="22"
        /></button
      ><button class="watch">
        <img
          src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
          alt=""
          width="22"
        /></button
      ><button class="watch">
        <img
          src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
          alt=""
          width="22"
        />
      </button>
      <button class="arrow">
        <img
          src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/7c7c7c/external-arrow-arrows-dreamstale-lineal-dreamstale-5.png"
          alt=""
          width="12"
        />
      </button>
    </section>
    <div class="add-task-line"></div>
    <button class="add-task-color">
      <img
        src="https://img.icons8.com/ios-glyphs/60/7c7c7c/circled-dot.png"
        width="18"
        alt=""
      />
    </button>
  </section>
</template>

<style scoped lang="scss">
.home-add-task {
  display: flex;
  padding: 10px;
  justify-content: center;
  align-items: center;

  background-color: #fff;
  box-shadow: 0px 0px 4px #cfcfcf;
  border-radius: 4px;

  button {
    padding: 2px;

    border-radius: 4px;
    transition: all 0.3s ease;
    background-color: #fff;
    font-size: 0;

    &:hover {
      background-color: #ededed;
    }
  }

  & > *:not(:last-child) {
    margin-right: 8px;
  }
}

.home-add-task .add-task-button {
  flex: 0 1 auto;
}
.home-add-task .add-task-input {
  flex: 1 1 auto;

  font-size: 14px;
  line-height: 21px;
  color: #7c7c7c;

  *::placeholder {
    color: #cfcfcf;
  }
}

.home-add-task .add-task-watch {
  flex: 0 1 auto;

  & > * {
    vertical-align: middle;
  }

  & > *:not(:last-child) {
    margin-right: 4px;
  }

  .arrow {
    padding: 7px;
  }
}

.home-add-task .add-task-line {
  flex: 0 1 1px;
  align-self: stretch;

  background-color: #ededed;
}

.home-add-task .add-task-arrow {
  flex: 0 1 auto;
  /* 第二層 flex */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
