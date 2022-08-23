<script setup></script>

<template>
    <!-- home-task-edit-box -->
    <section class="home-task-edit-box">
        <!-- home-task-edit-box edit-box-header -->
        <header class="edit-box-header">
            <section class="title">
                <BaseCheckbox />
                <HomeStartTimer />
                <h3>任務名稱</h3>
                <button>
                    <img
                        src="https://img.icons8.com/ios-glyphs/60/7c7c7c/empty-flag.png"
                        alt=""
                        width="20"
                    />
                </button>
            </section>
            <section class="tags">
                <div class="tag">
                    <span>標籤名稱</span>
                </div>
                <button class="add-tag tag">
                    <img
                        src="https://img.icons8.com/material-outlined/48/7c7c7c/plus-math--v1.png"
                        alt=""
                        width="12"
                    />
                    <span>標籤</span>
                </button>
            </section>
        </header>
        <!-- home-task-edit-box edit-box-line -->
        <div class="edit-box-line"></div>
        <!-- home-task-edit-box edit-box-main -->
        <main class="edit-box-main">
            <section class="list">
                <ul>
                    <li>
                        <img
                            src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                            alt=""
                            width="20"
                        />
                        <h4>標題</h4>
                        <button class="tomato">
                            <img
                                src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                                alt=""
                                width="14"
                            />
                            <span>3</span>
                            <span class="gray">/</span>
                            <img
                                src="https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png"
                                alt=""
                                width="14"
                            />
                            <span>2</span>
                        </button>
                    </li>
                    <li>
                        <img
                            src="https://img.icons8.com/material-outlined/48/7c7c7c/calendar--v1.png"
                            alt=""
                            width="20"
                        />
                        <h4>標題</h4>
                        <button class="date">文字</button>
                    </li>
                    <li>
                        <img
                            src="https://img.icons8.com/ios-glyphs/60/7c7c7c/folder-invoices--v1.png"
                            alt=""
                            width="20"
                        />
                        <h4>標題</h4>
                        <button class="folder">文字</button>
                    </li>
                    <li>
                        <img
                            src="https://img.icons8.com/material-rounded/48/7c7c7c/bell--v1.png"
                            alt=""
                            width="20"
                        />
                        <h4>標題</h4>
                        <button class="remind">文字</button>
                    </li>
                    <li>
                        <img
                            src="https://img.icons8.com/material-outlined/48/7c7c7c/repeat.png"
                            alt=""
                            width="20"
                        />
                        <h4>標題</h4>
                        <button class="repeat">文字</button>
                    </li>
                </ul>
            </section>
            <section class="subtask">
                <ul>
                    <li>
                        <BaseCheckbox />
                        <HomeStartTimer />
                        <h3>任務名稱</h3>
                    </li>
                </ul>

                <form>
                    <button>
                        <img
                            src="https://img.icons8.com/material-outlined/48/7c7c7c/plus-math--v1.png"
                            alt=""
                            width="20"
                        />
                    </button>
                    <input placeholder="子任務" type="text" />
                </form>
            </section>
            <section class="description">
                <form>
                    <textarea
                        id=""
                        placeholder="任務描述..."
                        name=""
                        cols="30"
                        rows="10"
                    ></textarea>
                </form>
            </section>
        </main>
        <!-- home-task-edit-box edit-box-line -->
        <div class="edit-box-line"></div>
        <!-- home-task-edit-box edit-box-footer -->
        <footer class="edit-box-footer">
            <button>
                <img
                    src="https://img.icons8.com/windows/32/7c7c7c/full-page-view.png"
                    alt=""
                    width="20"
                />
            </button>
            <p>創建於 3 月 3 日</p>
            <button>
                <img
                    src="https://img.icons8.com/material-outlined/48/7c7c7c/trash--v1.png"
                    alt=""
                    width="20"
                />
            </button>
        </footer>
    </section>
</template>

<style scoped lang="scss">
    .home-task-edit-box {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 280px;

        border-radius: 4px;
        background-color: $white-1;
        box-shadow: 0 0 4px $gray-2;

        button {
            font-size: 0;
            transition: all 0.3s ease;
            &:hover {
                background-color: $gray-1;
                border-radius: 4px;
            }
        }
    }

    .home-task-edit-box .edit-box-header {
        flex: 0 0 auto;
        padding: 12px;

        .title {
            display: flex;
            align-items: flex-start;
            margin-bottom: 18px;

            & > *:not(:last-child) {
                margin-right: 6px;
            }

            h3 {
                flex: 1 1 auto;
                font-size: 14px;
                line-height: 21px;
                color: $gray-4;
            }
        }

        .tags {
            font-size: 0px;
            .tag {
                display: inline-block;
                padding: 0 6px;

                border-radius: 12px;
                font-size: 12px;
                line-height: 18px;

                background-color: $red-1;
                border: 1px solid $red-2;
                &:not(:last-child) {
                    margin-right: 6px;
                }

                img,
                span {
                    margin-right: 2px;
                    vertical-align: middle;
                }
            }

            .add-tag {
                background-color: transparent;
                border: 1px dashed $gray-3;
            }
        }
    }

    .home-task-edit-box .edit-box-main {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;

        padding: 0 12px;

        .list {
            flex: 0 0 auto;

            li {
                display: flex;
                align-items: center;
                padding: 6px 0;

                & > *:not(:last-child) {
                    margin-right: 6px;
                }
            }

            h4 {
                flex: 1 1 auto;
                font-size: 14px;
                line-height: 21px;
                color: $gray-4;
            }

            button {
                margin-left: auto;
                padding: 4px;

                font-size: 14px;
                line-height: 21px;
                color: $gray-4;
            }

            .tomato {
                font-size: 0;
                line-height: 0;
                span {
                    font-size: 14px;
                    line-height: 21px;
                    color: $gray-4;
                }
                span,
                img {
                    vertical-align: middle;
                }
                .gray {
                    color: $gray-2;
                }
            }
        }
        .subtask {
            flex: 0 0 auto;
            padding: 12px 0;
            border-top: 1px solid $gray-1;
            border-bottom: 1px solid $gray-1;

            ul {
                margin-bottom: 12px;
            }

            li {
                display: flex;
                align-items: center;

                &:not(:last-child) {
                    margin-bottom: 12px;
                }

                & > *:not(:last-child) {
                    margin-right: 6px;
                }
            }

            h3 {
                font-size: 14px;
                line-height: 21px;
                color: $gray-4;
            }

            form {
                display: flex;
                align-items: center;
            }

            button {
                margin-right: 6px;
            }

            input {
                font-size: 14px;
                line-height: 21px;
                color: $gray-4;
            }
        }
        .description {
            flex: 1 1 auto;
            padding: 12px 0;
            display: flex;
            flex-direction: column;
            form {
                flex: 1 1 auto;
                display: flex;
                flex-direction: column;
            }

            textarea {
                flex: 1 1 auto;
                font-size: 14px;
                line-height: 21px;
                color: $gray-4;
            }
        }
    }

    .home-task-edit-box .edit-box-footer {
        flex: 0 0 auto;
        display: flex;
        justify-content: space-between;
        padding: 12px 9px;

        P {
            font-size: 14px;
            line-height: 21px;
            color: $gray-4;
        }
        button {
            padding: 2px;
        }
    }

    .home-task-edit-box .edit-box-line {
        flex: 0 0 1px;
        margin: 0 12px;
        background-color: $gray-1;
    }
</style>
