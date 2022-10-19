<script setup>
import { computed } from 'vue'
import { useToggleComponent } from '@/composables/useToggleComponent'

/* ========== component props ========== */

const props = defineProps({
    filterType: { type: Object, required: true },
    eachFolderTypeTotalTaskTime: { type: Array, required: true },
    isLoadingFolderTypesAdd: { type: Boolean, required: true },
})

/* ========== component emits ========== */

const emits = defineEmits(['add-folder-type', 'update:filter-type'])

/* ========== component logic ========== */

// sidebar 項目
const {
    sidebarItems,
    updateSelectSidebarItem,
    isSidebarItemSelect,
    isSidebarFolderItemSelect,
} = useSelectSidebarItem({ props })

// folder confirm 框是否可見
const { visible: isFolderConfirmVisible } = useToggleComponent()

/*========== component scoped composables function ========== */

// sidebar 項目
function useSelectSidebarItem({ props }) {
    // sidebar 項目
    const sidebarItems = [
        { name: '今天', type: 'taskOfToday', iconUrl: getImageUrl('sun.png') },
        {
            name: '稍後',
            type: 'taskOfFuture',
            iconUrl: getImageUrl('external-sunset-3.png'),
        },
        {
            name: '尚未安排',
            type: 'taskOfNoExpectTime',
            iconUrl: getImageUrl('calendar--v1-1.png'),
        },
        {
            name: '全部',
            type: 'all',
            iconUrl: getImageUrl('calendar--v1-2.png'),
        },
        {
            name: '已完成',
            type: 'taskOfFinish',
            iconUrl: getImageUrl('checked.png'),
        },
    ]

    // 當前 sidebar 項目是否選中
    const isSidebarItemSelect = computed(() => (sidebarItemType) => {
        return sidebarItemType === props.filterType.type
    })

    // 當前 folder sidebar 項目是否選中
    const isSidebarFolderItemSelect = computed(
        () => (sidebarFolderItemType) => {
            if (props.filterType.type !== 'taskOfTheFolder') return
            return sidebarFolderItemType === props.filterType.param
        }
    )

    // 更換當前選中的 sidebar 項目 (emit)
    const updateSelectSidebarItem = (filterTypeType, param) => {
        emits('update:filter-type', { type: filterTypeType, param })
    }

    return {
        sidebarItems,
        updateSelectSidebarItem,
        isSidebarItemSelect,
        isSidebarFolderItemSelect,
    }
}

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
                    v-for="item of sidebarItems"
                    :key="item.type"
                    class="sidebar-item-wrapper"
                    @click="updateSelectSidebarItem(item.type)"
                >
                    <a
                        :class="[
                            'sidebar-item',
                            isSidebarItemSelect(item.type) ? 'active' : '',
                        ]"
                    >
                        <img :src="item.iconUrl" width="22" />
                        <h3>{{ item.name }}</h3>
                        <p class="total-spend-time">6h</p>
                        <p class="pomorodo-time">6</p>
                    </a>
                </li>
            </ul>
        </section>
        <div class="sidebar-line"></div>
        <!-- home-sidebar sidebar-folder -->
        <section class="sidebar-base folder">
            <ul class="sidebar-list">
                <li
                    v-for="folderType of eachFolderTypeTotalTaskTime"
                    :key="folderType.id"
                    class="sidebar-item-wrapper"
                    @click="
                        $emit('update:filter-type', {
                            type: 'taskOfTheFolder',
                            param: folderType.name,
                        })
                    "
                >
                    <a
                        :class="[
                            'sidebar-item',
                            isSidebarFolderItemSelect(folderType.name)
                                ? 'active'
                                : '',
                        ]"
                    >
                        <img
                            src="@/assets/images/folder-invoices--v1.png"
                            width="22"
                        />
                        <h3>{{ folderType.name }}</h3>
                        <p class="total-spend-time">
                            {{ folderType.time + 'h' }}
                        </p>
                        <p class="pomorodo-time">{{ '1' }}</p>
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
            color: $green-0;
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

    p.total-spend-time {
        margin-left: auto;
    }
}
</style>
