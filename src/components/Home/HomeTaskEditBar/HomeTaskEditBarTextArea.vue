<script setup>
defineProps({
    value: { type: String, required: true },
})

defineEmits(['update:value'])
</script>

<template>
    <textarea
        placeholder="任務描述..."
        name=""
        cols="30"
        rows="10"
        class="textarea"
        :value="value"
        @input="$emit('update:value', $event.target.value)"
    />
</template>

<style scoped lang="scss">
.textarea {
    width: 100%;
    font-size: 14px;
    flex: 1 1 auto;
    line-height: 21px;
    color: $gray-4;
    word-wrap: break-word;
}
</style>
