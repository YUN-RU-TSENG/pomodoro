<script setup>
defineEmits('update:visible')
</script>

<template>
    <div
        class="base-modal-wrapper"
        @click.self="$emit('update:visible', false)"
    >
        <section class="base-modal">
            <div class="base-modal-header">
                <h3 class="base-modal-title">
                    <slot name="header">標題</slot>
                </h3>
            </div>
            <div class="base-modal-body">
                <slot name="body"> </slot>
            </div>
            <div class="base-modal-footer">
                <slot name="footer"> </slot>
            </div>
        </section>
    </div>
</template>

<style scoped lang="scss">
.base-modal {
    padding: 14px;
    border-radius: 4px;
    background-color: $white-1;
}

.base-modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999;

    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;

    background-color: $gray-5;
}

.base-modal-header {
    margin-bottom: 14px;
}

.base-modal-title {
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: $gray-4;
}

.base-modal-body {
    margin-bottom: 14px;
}

.base-modal-footer {
}
</style>
