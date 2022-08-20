<script setup></script>

<template>
    <section class="base-popover">
        <div class="popover-arrow"></div>
        <slot></slot>
    </section>
</template>

<style scoped lang="scss">
    .base-popover {
        margin-top: 12px;
        position: absolute;
        padding: 12px;
        z-index: 99;

        border-radius: 4px;
        background-color: $white-1;
        box-shadow: 0 0 4px $gray-1;
    }

    .base-popover .popover-arrow {
        position: absolute;
        top: -12px;
        right: 24px;

        border-color: transparent transparent $white-1 transparent;
        border-style: solid solid solid solid;
        border-width: 6px;
        border-radius: 4px;
        z-index: 9;
    }
</style>
