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
    <nav class="home-navbar">
        <!-- home-navbar navbar-user -->
        <div class="navbar-user">
            <img
                src="@/assets/images/external-User-users-those-icons-fill-those-icons-3.png"
                width="24"
            />
            <span>{{ user.email }}</span>
        </div>
        <!-- home-navbar navbar-links -->
        <div class="navbar-links">
            <ul>
                <li>
                    <button>
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
                    <button>
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
