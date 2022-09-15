<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
    <nav class="home-navbar">
        <!-- home-navbar navbar-user -->
        <div class="navbar-user">
            <img
                src="https://img.icons8.com/external-those-icons-fill-those-icons/48/7c7c7c/external-User-users-those-icons-fill-those-icons-3.png"
                alt=""
                width="24"
            />
            <span>RURU</span>
        </div>
        <!-- home-navbar navbar-links -->
        <div class="navbar-links">
            <ul>
                <li>
                    <button>
                        <img
                            src="https://img.icons8.com/ios-glyphs/60/7c7c7c/combo-chart--v1.png"
                            alt=""
                            width="24"
                        />
                    </button>
                </li>
                <li>
                    <button>
                        <img
                            src="https://img.icons8.com/material-rounded/48/7c7c7c/bell--v1.png"
                            alt=""
                            width="24"
                        />
                    </button>
                </li>
                <li>
                    <button>
                        <img
                            src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/7c7c7c/external-setting-essentials-pack-tanah-basah-glyph-tanah-basah.png"
                            alt=""
                            width="24"
                        />
                    </button>
                </li>
                <li>
                    <button @click="userStore.logout">
                        <img
                            src="https://img.icons8.com/metro/48/7c7c7c/exit.png"
                            alt=""
                            width="24"
                        />
                    </button>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped lang="scss">
.home-navbar {
    display: flex;
    align-items: center;
    padding: 10px 14px;

    background-color: $white-1;
    box-shadow: 0px 0px 4px $gray-1;
}

.home-navbar .navbar-user {
    img {
        vertical-align: middle;
        margin-right: 12px;
    }

    span {
        color: $gray-4;
        vertical-align: middle;
        font-size: 14px;
    }
}

.home-navbar .navbar-links {
    margin-left: auto;

    li {
        display: inline-block;
        margin-right: 12px;
    }

    button {
        display: inline-block;
        width: auto;
        height: auto;
    }

    img {
        vertical-align: middle;
    }
}
</style>
