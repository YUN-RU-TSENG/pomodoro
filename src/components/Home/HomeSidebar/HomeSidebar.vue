<script setup>
import { useToggleComponent } from '@/composables/useToggleComponent'

/* ========== component props ========== */

defineProps({
    selectedFilterOption: { type: Object, required: true },
    filterTaskOptionsFormatForSidebar: { type: Array, required: true },
    filterTaskFolderOptionsFormatForSidebar: { type: Array, required: true },
    isLoadingFolderTypesAdd: { type: Boolean, required: true },
})

/* ========== component emits ========== */

defineEmits(['add-folder-type', 'update:selected-filter-option'])

/* ========== component logic ========== */

const { visible: isFolderConfirmVisible } = useToggleComponent()

/*========== component scoped composables function ========== */

// 取得 img url
function getImageUrl(name) {
    return new URL(`../../../assets/images/${name}`, import.meta.url).href
}
</script>

<template>
    <section class="home-sidebar">
        <!-- home-sidebar sidebar-base -->
        <section class="sidebar-base">
            <!-- home-sidebar sidebar-list -->
            <ul class="sidebar-list">
                <!-- home-sidebar sidebar-item -->
                <li
                    v-for="option of filterTaskOptionsFormatForSidebar"
                    :key="option.type"
                    class="sidebar-item-wrapper"
                    @click="
                        $emit('update:selected-filter-option', {
                            key: option.key,
                            name: option.name,
                            filterFun: option.filterFun,
                        })
                    "
                >
                    <a
                        :class="[
                            'sidebar-item',
                            selectedFilterOption.key === option.key
                                ? 'active'
                                : '',
                        ]"
                    >
                        <img :src="getImageUrl(option.imgName)" width="22" />
                        <h3>{{ option.name }}</h3>
                        <p class="total-spend-time">
                            {{
                                Math.floor(
                                    option.tasksTotalExpectTime / 60 / 60
                                ) + 'h'
                            }}
                        </p>
                        <p class="pomodoro-time">{{ option.tasksNumber }}</p>
                    </a>
                </li>
            </ul>
        </section>
        <div class="sidebar-line"></div>
        <!-- home-sidebar sidebar-folder -->
        <section class="sidebar-base folder">
            <ul class="sidebar-list">
                <li
                    v-for="option of filterTaskFolderOptionsFormatForSidebar"
                    :key="option.name"
                    class="sidebar-item-wrapper"
                    @click="
                        $emit('update:selected-filter-option', {
                            key: option.key,
                            name: option.name,
                            filterFun: option.filterFun,
                        })
                    "
                >
                    <a
                        :class="[
                            'sidebar-item',
                            selectedFilterOption.name === option.name
                                ? 'active'
                                : '',
                        ]"
                    >
                        <img
                            src="@/assets/images/folder-invoices--v1.png"
                            width="22"
                        />
                        <h3>{{ option.name }}</h3>
                        <p class="total-spend-time">
                            {{
                                Math.floor(
                                    option.tasksTotalExpectTime / 60 / 60
                                ) + 'h'
                            }}
                        </p>
                        <p class="pomodoro-time">{{ option.tasksNumber }}</p>
                    </a>
                </li>
            </ul>
        </section>
        <!-- home-sidebar sidebar-footer -->
        <footer class="sidebar-footer">
            <button class="add" @click="visible = true">
                <img src="@/assets/images/add--v1-1.png" width="22" /><span
                    >新增項目</span
                >
            </button>
            <button class="tag">
                <img src="@/assets/images/sale-price-tag.png" width="22" />
            </button>
            <button
                class="folder"
                :disabled="isLoadingFolderTypesAdd"
                @click="isFolderConfirmVisible = true"
            >
                <img
                    v-show="!isLoadingFolderTypesAdd"
                    src="@/assets/images/folder-invoices--v1-2.png"
                    width="22"
                />
                <img
                    v-show="isLoadingFolderTypesAdd"
                    src="@/assets/images/external-Load-interface-those-icons-lineal-those-icons-1.png"
                    width="22"
                />
            </button>
        </footer>
        <HomeFolderModelConfirm
            v-model:visible="isFolderConfirmVisible"
            :current-folders="filterTaskFolderOptionsFormatForSidebar"
            @on-submit="$emit('add-folder-type', $event)"
        />
    </section>
</template>

<style scoped lang="scss">
.home-sidebar {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 240px;

    background-color: $white-1;
    box-shadow: 0px 0px 4px $gray-1;

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

    &.folder {
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
            background-color: $gray-0;
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
            color: $gray-4;
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
        background-color: $gray-0;
    }

    *:not(:last-child) {
        margin-right: 12px;
    }

    h3 {
        font-size: 14px;
        line-height: 21px;
        color: $gray-4;
        font-weight: 300;
    }

    p {
        font-size: 12px;
        line-height: 18px;
        color: $gray-3;
    }

    .pomodoro-time {
        flex: 0 1 24px;
        text-align: right;
    }

    p.total-spend-time {
        margin-left: auto;
    }
}
</style>
