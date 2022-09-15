<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
    <section class="home">
        <!-- home home-navbar -->
        <HomeNavbar class="home-navbar"></HomeNavbar>
        <!-- home home-workspace -->
        <main class="home-workspace">
            <!-- workspace-sidebar -->
            <HomeSidebar
                class="workspace-sidebar"
                style="height: calc(100vh - 45px)"
            ></HomeSidebar>
            <!-- workspace-current-task -->
            <section class="workspace-current-task">
                <div class="task-list">
                    <div class="list-title">
                        <h2>今天</h2>
                        <button class="sort">
                            <img
                                src="https://img.icons8.com/fluency-systems-filled/48/000000/sort.png"
                                alt=""
                                width="20"
                            />1
                        </button>
                    </div>
                    <HomeAddTask></HomeAddTask>
                    <HomeList></HomeList>
                </div>
                <div class="task-detail">
                    <HomeTaskEditBar
                        style="height: calc(100vh - 45px - 24px)"
                    />
                </div>
            </section>
        </main>
        <!-- home-tomato-clock -->
        <HomeTomatoClock class="home-tomato-clock"></HomeTomatoClock>
        <BaseLoading v-if="userStore.isLoading" />
    </section>
</template>

<style lang="scss" scoped>
.home {
    button {
        font-size: 0px;
    }
}
.home-navbar {
    z-index: 9;
    position: relative;
}

.home-workspace {
    display: flex;
    position: relative;
    z-index: 1;
}

.workspace-current-task {
    flex: 1 1 auto;
    display: flex;
    padding: 12px;
    height: calc(100vh - 45px);

    background-color: $gray-0;

    .task-list {
        flex: 1 1 auto;
        margin-right: 12px;
        transition: all 0.3s ease;

        .list-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }

        .home-add-task {
            margin-bottom: 24px;
        }

        .home-list {
            margin-bottom: 24px;
        }

        h2 {
            font-size: 24px;
            line-height: 36px;
            font-weight: 400;
        }

        button {
            padding: 4px;
            background-color: $gray-1;
            border-radius: 4px;
        }
    }

    .task-detail {
        &.no-show {
            display: none;
        }
    }
}

.home-tomato-clock {
    position: fixed;
    top: auto;
    bottom: 24px;
    left: 0;
    right: 0;
    margin: 0 auto;
}
</style>
