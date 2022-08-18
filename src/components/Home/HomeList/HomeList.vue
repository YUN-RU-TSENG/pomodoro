<script setup></script>

<template>
    <section class="home-list">
        <h3 class="list-title">標題</h3>
        <ul class="list-wrapper">
            <li class="list-item-wrapper">
                <a href="" class="list-item">
                    <BaseCheckbox class="checkbox" />
                    <HomeStartTimer class="start-timer" />
                    <section class="content">
                        <input type="text" class="text" value="預想文字" />
                        <div class="timers">
                            <img
                                src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                                width="12"
                                alt=""
                            /><img
                                src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                                width="12"
                                alt=""
                            /><img
                                src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                                width="12"
                                alt=""
                            /><img
                                src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                                width="12"
                                alt=""
                            />
                        </div>
                    </section>
                    <p class="date">今天</p>
                </a>
            </li>
            <li class="list-item-wrapper">
                <a href="" class="list-item">
                    <BaseCheckbox class="checkbox" />
                    <HomeStartTimer class="start-timer" />
                    <section class="content">
                        <input type="text" class="text" value="預想文字" />
                        <div class="timers">
                            <img
                                src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                                width="12"
                                alt=""
                            /><img
                                src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                                width="12"
                                alt=""
                            /><img
                                src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                                width="12"
                                alt=""
                            /><img
                                src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                                width="12"
                                alt=""
                            />
                        </div>
                    </section>
                    <p class="date">今天</p>
                </a>
            </li>
        </ul>
    </section>
</template>

<style scoped lang="scss">
    .home-list {
        margin-bottom: 24px;
    }
    .home-list .list-title {
        margin-bottom: 12px;

        font-size: 14px;
        line-height: 21px;
        color: $gray-4;
    }

    .home-list .list-wrapper {
    }

    .home-list .list-item-wrapper {
        display: block;

        &:not(:last-child) {
            margin-bottom: 6px;
        }
    }

    .home-list .list-item {
        display: flex;
        align-items: center;
        padding: 6px;

        box-shadow: 0 1px 3px $gray-1;
        transition: all 0.3s ease;
        background-color: $white-1;
        border-radius: 4px;

        &:hover,
        &.active {
            background-color: $gray-1;
        }

        & > *:not(:last-child) {
            margin-right: 6px;
        }

        .checkbox {
            flex: 0 1 auto;
        }

        .start-timer {
            flex: 0 1 auto;
        }

        .content {
            flex: 1 1 auto;

            .text {
                width: 100%;
                margin-bottom: 4px;

                font-size: 12px;
                line-height: 18px;
            }

            .timers {
                font-size: 0;

                & > *:not(:last-child) {
                    margin-right: 4px;
                }
            }
        }

        .date {
            flex: 0 1 auto;

            font-size: 12px;
            line-height: 18px;
            color: $gray-3;
        }
    }
</style>
