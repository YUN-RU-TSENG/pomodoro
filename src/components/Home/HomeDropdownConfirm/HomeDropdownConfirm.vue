<script setup>
/* ========== component props ========== */

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

/* ========== component emit ========== */

defineEmits(['update:value'])
</script>

<template>
    <div class="home-dropdown" style="width: 160px">
        <label
            v-for="(content, index) of contents"
            :key="index"
            :for="name + index"
            class="dropdown-item"
        >
            <input
                :id="name + index"
                type="radio"
                :name="name"
                :value="content.name"
                :checked="content.name == value"
                @input="$emit('update:value', $event.target.value)"
            />
            <div class="box">
                <div class="color"></div>
                <p class="content">{{ content.name }}</p>
                <img
                    src="@/assets/images/external-checked-interface-dreamstale-lineal-dreamstale.png"
                    width="12"
                    class="checked"
                />
            </div>
        </label>
    </div>
</template>

<style scoped lang="scss">
.home-dropdown .dropdown-item {
    display: block;

    input {
        display: none;
    }

    input:checked ~ .box .checked {
        visibility: visible;
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
        background-color: $green-1;
    }

    .content {
        font-size: 14px;
        line-height: 21px;
    }

    .checked {
        visibility: collapse;
        margin-left: auto;
    }
}
</style>
