<script setup></script>

<template>
    <section class="home-sidebar">
        <!-- home-sidebar sidebar-base -->
        <section class="sidebar-base">
            <!-- home-sidebar sidebar-list -->
            <ul class="sidebar-list">
                <!-- home-sidebar sidebar-item -->
                <li class="sidebar-item-wrapper">
                    <a class="sidebar-item">
                        <img
                            src="https://img.icons8.com/android/48/4EA936/sun.png"
                            alt=""
                            width="22"
                        />
                        <h3>名稱</h3>
                        <p class="total-spend-time">6h</p>
                        <p class="tomato-time">6</p>
                    </a>
                </li>
                <li class="sidebar-item-wrapper">
                    <!-- 點擊為當前項目時，當前項目會呈現選中狀態，添加 active -->
                    <a class="sidebar-item active">
                        <img
                            src="https://img.icons8.com/external-royyan-wijaya-basic-outline-royyan-wijaya/48/EE7337/external-sunset-weather-royyan-wijaya-basic-outline-royyan-wijaya-3.png"
                            alt=""
                            width="22"
                        />
                        <h3>名稱</h3>
                        <p class="total-spend-time">6h</p>
                        <p class="tomato-time">6</p>
                    </a>
                </li>
                <li class="sidebar-item-wrapper">
                    <a class="sidebar-item">
                        <img
                            src="https://img.icons8.com/material-outlined/48/3990F7/calendar--v1.png"
                            alt=""
                            width="22"
                        />
                        <h3>名稱</h3>
                        <p class="total-spend-time">6h</p>
                        <p class="tomato-time">6</p>
                    </a>
                </li>
                <li class="sidebar-item-wrapper">
                    <a class="sidebar-item">
                        <img
                            src="https://img.icons8.com/material-outlined/48/7461EF/calendar--v1.png"
                            alt=""
                            width="22"
                        />
                        <h3>名稱</h3>
                        <p class="total-spend-time">6h</p>
                        <p class="tomato-time">6</p>
                    </a>
                </li>
                <li class="sidebar-item-wrapper">
                    <a class="sidebar-item">
                        <img
                            src="https://img.icons8.com/metro/26/7c7c7c/checked.png"
                            alt=""
                            width="22"
                        />
                        <h3>名稱</h3>
                        <p class="total-spend-time">6h</p>
                        <p class="tomato-time">6</p>
                    </a>
                </li>
            </ul>
        </section>
        <!-- home-sidebar sidebar-line -->
        <div class="sidebar-line"></div>
        <!-- home-sidebar sidebar-folder -->
        <section class="sidebar-folder">
            <ul class="sidebar-list">
                <li class="sidebar-item-wrapper">
                    <a class="sidebar-item">
                        <img
                            src="https://img.icons8.com/ios-glyphs/60/7CC1E4/folder-invoices--v1.png"
                            alt=""
                            width="22"
                        />
                        <h3>名稱</h3>
                        <p class="total-spend-time">6h</p>
                        <p class="tomato-time">6</p>
                        <button class="arrow">
                            <img
                                src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/ededed/external-arrow-arrows-dreamstale-lineal-dreamstale-5.png"
                                width="12"
                                alt=""
                            />
                        </button>
                    </a>
                    <!-- 隱藏 folder 子項目時，添加 un-show -->
                    <div class="subitem un-show">
                        <div class="line"></div>
                        <ul class="list">
                            <li class="sidebar-item-wrapper">
                                <a class="sidebar-item">
                                    <img
                                        src="https://img.icons8.com/ios-glyphs/60/ededed/circled-dot.png"
                                        alt=""
                                        width="22"
                                    />
                                    <h3>名稱</h3>
                                    <p class="total-spend-time">6h</p>
                                    <p class="tomato-time">6</p>
                                </a>
                            </li>
                            <li class="sidebar-item-wrapper">
                                <a class="sidebar-item">
                                    <img
                                        src="https://img.icons8.com/ios-glyphs/60/ededed/circled-dot.png"
                                        alt=""
                                        width="22"
                                    />
                                    <h3>名稱</h3>
                                    <p class="total-spend-time">6h</p>
                                    <p class="tomato-time">6</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="sidebar-item-wrapper">
                    <a class="sidebar-item">
                        <img
                            src="https://img.icons8.com/ios-glyphs/60/7CC1E4/folder-invoices--v1.png"
                            alt=""
                            width="22"
                        />
                        <h3>名稱</h3>
                        <p class="total-spend-time">6h</p>
                        <p class="tomato-time">6</p>
                        <button class="arrow">
                            <img
                                src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/ededed/external-arrow-arrows-dreamstale-lineal-dreamstale-5.png"
                                width="12"
                                alt=""
                            />
                        </button>
                    </a>
                    <div class="subitem">
                        <div class="line"></div>
                        <ul class="list">
                            <li class="sidebar-item-wrapper">
                                <a class="sidebar-item">
                                    <img
                                        src="https://img.icons8.com/ios-glyphs/60/ededed/circled-dot.png"
                                        alt=""
                                        width="22"
                                    />
                                    <h3>名稱</h3>
                                    <p class="total-spend-time">6h</p>
                                    <p class="tomato-time">6</p>
                                </a>
                            </li>
                            <li class="sidebar-item-wrapper">
                                <a class="sidebar-item">
                                    <img
                                        src="https://img.icons8.com/ios-glyphs/60/ededed/circled-dot.png"
                                        alt=""
                                        width="22"
                                    />
                                    <h3>名稱</h3>
                                    <p class="total-spend-time">6h</p>
                                    <p class="tomato-time">6</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </section>
        <!-- home-sidebar sidebar-footer -->
        <footer class="sidebar-footer">
            <button class="add">
                <img
                    src="https://img.icons8.com/ios-glyphs/60/eb635c/add--v1.png"
                    width="22"
                    alt=""
                /><span>新增項目</span>
            </button>
            <button class="tag">
                <img
                    src="https://img.icons8.com/material-outlined/24/eb635c/sale-price-tag.png"
                    width="22"
                    alt=""
                />
            </button>
            <button class="folder">
                <img
                    src="https://img.icons8.com/ios-glyphs/60/eb635c/folder-invoices--v1.png"
                    width="22"
                    alt=""
                />
            </button>
        </footer>
    </section>
</template>

<style scoped lang="scss">
    .home-sidebar {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 240px;

        background-color: $white-1;
        box-shadow: 0px 0px 4px $gray-2;

        button {
            img,
            span {
                vertical-align: middle;
            }
        }

        li {
            display: block;
        }
    }

    .home-sidebar .sidebar-base {
        flex: 0 1 auto;
        padding: 10px;
    }

    .home-sidebar .sidebar-folder {
        flex: 1 1 auto;
        overflow: hidden;
        padding: 10px;

        .subitem {
            display: flex;
            margin-top: 12px;

            /* 隱藏 folder 子項目時，添加 un-show  */
            &.un-show {
                display: none;
            }
        }

        .line {
            flex: 0 1 1px;
            margin-left: 18px;
            margin-right: 8px;

            background-color: $gray-1;
        }

        .list {
            flex: 1 1 auto;
        }
    }

    .home-sidebar .sidebar-line {
        flex: 0 1 auto;
        margin: 10px 6px;
        height: 1px;

        background-color: $gray-1;
    }

    .home-sidebar .sidebar-footer {
        flex: 0 1 auto;
        align-items: center;
        border-top: 1px solid $gray-1;

        display: flex;
        padding: 10px 6px;

        & > *:not(:last-child) {
            margin-right: 6px;
        }

        button {
            border-radius: 4px;
            transition: all 0.3s ease;
            &:hover {
                background-color: $gray-1;
            }
        }

        button.add {
            flex: 0 1 auto;

            img {
                margin-right: 6px;
            }

            span {
                font-size: 14px;
                line-height: 21px;
                color: $red-1;
            }
        }

        button.tag {
            flex: 0 1 auto;
            margin-left: auto;
        }

        button.folder {
            flex: 0 1 auto;
        }
    }

    /* 頁面的 subitem 樣式相同，樣式統一使用 sidebar-item  */
    .home-sidebar .sidebar-item {
        display: flex;
        padding: 10px 6px;
        align-items: center;

        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;

        /* 點擊為當前項目時，當前項目會呈現選中狀態，添加 active */
        &.active,
        &:hover {
            background-color: $gray-1;
        }

        *:not(:last-child) {
            margin-right: 12px;
        }

        h3 {
            font-size: 14px;
            line-height: 21px;
            color: $gray-4;
        }

        p {
            font-size: 12px;
            line-height: 18px;
            color: $gray-3;
        }

        p.total-spend-time {
            margin-left: auto;
        }
    }
</style>
