<script setup></script>

<template>
    <BasePopover style="width: 160px" class="home-number">
        <BaseInput class="number-input"> </BaseInput>

        <section class="mention-check">
            <BaseButton></BaseButton>
            <BaseButton></BaseButton>
        </section>
    </BasePopover>
</template>

<style scoped lang="scss">
.home-number {
}
.home-number .number-input {
    margin-bottom: 12px;
}

.home-number .mention-check {
    display: flex;
    justify-content: space-between;
}
</style>
