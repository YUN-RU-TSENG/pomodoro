<script setup></script>

<template>
    <!-- home-tomato -->
    <section class="home-tomato small">
        <!-- home-tomato tomato-full -->
        <div class="tomato-full un-show">
            <button class="toggle">
                <img
                    src="https://img.icons8.com/windows/32/ffffff/full-page-view.png"
                    alt=""
                    width="24"
                />
            </button>
            <section class="item">
                <BaseCheckbox class="checkbox" :value="false" />

                <section class="content">
                    <p class="text">預想文字</p>
                    <div class="timers">
                        <img
                            src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                            width="12"
                            alt=""
                        />
                        <span>7</span>
                        <span>/</span>
                        <img
                            src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                            width="12"
                            alt=""
                        />
                        <span>7</span>
                    </div>
                </section>
                <button class="close">
                    <img
                        src="https://img.icons8.com/material-two-tone/24/000000/delete-sign.png"
                        alt=""
                        width="12"
                    />
                </button>
            </section>
            <div class="clock">
                <svg height="400" width="400" viewBox="0 0 400 400" fill="red">
                    <circle
                        r="190"
                        cx="200"
                        cy="200"
                        stroke="#fff"
                        fill="none"
                        stroke-width="10"
                    />
                    <circle
                        r="190"
                        cx="200"
                        cy="200"
                        stroke="#D56140"
                        fill="none"
                        stroke-dasharray="calc(90 * 3.14 * 190 * 2 / 360) calc(270 * 3.14 * 190 * 2 / 360)"
                        stroke-width="10"
                        transform-origin="center"
                        transform="rotate(270)"
                    />
                    <text
                        x="50%"
                        y="50%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        style="font-size: 72px; fill: #fff"
                    >
                        12:06
                    </text>
                </svg>
            </div>
            <div class="stop">
                <button>
                    <img
                        src="https://img.icons8.com/material-outlined/48/ffffff/circled-play.png"
                        width="48"
                        alt=""
                    />
                </button>
            </div>
        </div>
        <!-- home-tomato tomato-small -->
        <div class="tomato-small">
            <button class="clock">
                <svg height="36" width="36" viewBox="0 0 36 36" fill="red">
                    <circle
                        r="16"
                        cx="18"
                        cy="18"
                        stroke="#fff"
                        fill="none"
                        stroke-width="2"
                    />
                    <circle
                        r="16"
                        cx="18"
                        cy="18"
                        stroke="#D56140"
                        fill="none"
                        stroke-dasharray="calc(90 * 3.14 * 16 * 2 / 360) calc(270 * 3.14 * 16 * 2 / 360)"
                        stroke-width="2"
                        transform-origin="center"
                        transform="rotate(270)"
                    />
                    <text
                        x="50%"
                        y="51%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        style="font-size: 16px; fill: #fff"
                    >
                        43
                    </text>
                </svg>
            </button>
            <div class="text">文字溢出測試溢出測試</div>
            <!-- <button class="stop">
                <img
                    src="https://img.icons8.com/ios-glyphs/60/ffffff/circled-pause.png"
                    width="24"
                    alt=""
                />
            </button> -->
            <button class="play">
                <img
                    src="https://img.icons8.com/material-outlined/48/ffffff/circled-play.png"
                    width="32"
                    alt=""
                />
            </button>
            <button class="break">
                <img
                    src="https://img.icons8.com/sf-regular/48/ffffff/stop-squared.png"
                    width="24"
                    alt=""
                />
            </button>
        </div>
    </section>
</template>

<style scoped lang="scss">
.home-tomato {
    transition: all 0.3s ease;
    background-color: $red-2;
    box-shadow: 0 0 4px $gray-2;

    &.full {
        width: 100vw;
        height: 100vh;
        bottom: 0;
        top: 0;
        border-radius: 0px;
    }

    &.small {
        width: 196px;
        height: 48px;
        border-radius: 4px;
    }

    button {
        font-size: 0;
        img {
            vertical-align: middle;
        }
    }
}

.home-tomato .tomato-full {
    padding-top: 120px;
    .toggle {
        position: absolute;
        top: 6px;
        left: 6px;
    }

    .item {
        width: 400px;
        margin: 0 auto;

        display: flex;
        align-items: center;
        padding: 6px;

        box-shadow: 0 1px 3px $gray-1;
        transition: all 0.3s ease;
        background-color: $white-1;
        border-radius: 4px;

        &:hover,
        &.active {
            background-color: $gray-0;
        }

        & > *:not(:last-child) {
            margin-right: 6px;
        }

        .checkbox {
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
                font-size: 12px;
                line-height: 18px;

                & > *:not(:last-child) {
                    margin-right: 4px;
                }

                img,
                span {
                    vertical-align: middle;
                }
            }
        }

        .close {
            flex: 0 1 auto;
            align-self: flex-start;
        }
    }

    .clock {
        margin: 48px auto 0;
        text-align: center;
    }

    .stop {
        margin: 24px auto 0;
        text-align: center;
    }
}

.home-tomato .tomato-small {
    display: flex;
    padding: 6px;
    align-items: center;

    & > *:not(:last-child) {
        margin-right: 6px;
    }

    .clock {
        flex: 0 0 auto;

        svg {
            vertical-align: middle;
        }
    }

    .text {
        flex: 1 1 auto;
        font-size: 14px;
        line-height: 21px;
        color: $white-1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .stop,
    .play,
    .break {
        flex: 0 0 auto;
    }
}

.home-tomato .un-show {
    display: none;
}
</style>
