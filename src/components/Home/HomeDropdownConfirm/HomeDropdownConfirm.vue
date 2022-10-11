<script setup>
defineProps({
    contents: {
        type: Array,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
})

defineEmits(['update:value'])
</script>

<template>
    <div class="home-dropdown" style="width: 160px">
        <label
            v-for="(content, index) of contents"
            :key="index"
            :for="content.id"
            class="dropdown-item"
        >
            <input
                :id="content.id"
                type="radio"
                :name="name"
                :value="content.file"
                :checked="content.file === value"
                @change="$emit('update:value', $event.target.value)"
            />
            <div class="box">
                <div class="color"></div>
                <p class="content">{{ content.file }}</p>
                <img
                    src="@/assets/images/external-checked-interface-dreamstale-lineal-dreamstale.png"
                    alt=""
                    width="12"
                    class="checked"
                />
            </div>
        </label>
    </div>
</template>

<style scoped lang="scss">
.home-dropdown {
}

.home-dropdown .dropdown-item {
    input {
        display: none;
    }

    .box {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 4px 0;

        & > *:not(:last-child) {
            margin-right: 12px;
        }
    }

    .color {
        width: 6px;
        height: 6px;
        border-radius: 6px;
        background-color: $red-2;
    }

    .content {
        font-size: 14px;
        line-height: 21px;
    }

    .checked {
        visibility: collapse;
        margin-left: auto;
    }

    input:checked ~ .box .checked {
        visibility: visible;
    }
}
</style>
