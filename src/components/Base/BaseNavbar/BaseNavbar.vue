<script setup>
/*========== component props ========== */

defineProps({
    user: {
        type: Object,
        required: true,
    },
})

/*========== component emit ========== */

defineEmits(['user-logout'])
</script>

<template>
    <nav class="base-navbar">
        <!-- base-navbar navbar-user -->
        <div class="navbar-user">
            <img
                src="@/assets/images/external-User-users-those-icons-fill-those-icons-3.png"
                width="24"
            />
            <span>{{ user.email }}</span>
        </div>
        <!-- base-navbar navbar-links -->
        <div class="navbar-links">
            <ul>
                <li>
                    <button @click="$router.push({ name: 'dashboard' })">
                        <img
                            src="@/assets/images/combo-chart--v1.png"
                            width="24"
                        />
                    </button>
                </li>
                <li>
                    <button>
                        <img src="@/assets/images/bell--v1.png" width="24" />
                    </button>
                </li>
                <li>
                    <button
                        @click="$router.push({ name: 'home' }).catch(() => {})"
                    >
                        <img src="@/assets/images/home-page.png" width="24" />
                    </button>
                </li>
                <li>
                    <button @click="$router.push({ name: 'pomodoroSetting' })">
                        <img
                            src="@/assets/images/external-setting-essentials-pack-tanah-basah-glyph-tanah-basah.png"
                            width="24"
                        />
                    </button>
                </li>
                <li>
                    <button @click="$emit('user-logout')">
                        <img src="@/assets/images/exit.png" width="24" />
                    </button>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped lang="scss">
.base-navbar {
    display: flex;
    align-items: center;
    padding: 10px 14px;

    background-color: $white-1;
    box-shadow: 0px 0px 4px $gray-1;
}

.base-navbar .navbar-user {
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

.base-navbar .navbar-links {
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
