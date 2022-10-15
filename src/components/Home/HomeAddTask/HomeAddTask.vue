<script setup>
import { ref } from 'vue'
import { useCovertBetweenTimeAndPomorodo } from '@/composables/useCovertBetweenTimeAndPomorodo'

const props = defineProps({
    pomorodoTime: {
        type: Number,
        required: true,
    },
    cacheAddForm: {
        type: Object,
        required: true,
    },
    fileTypes: {
        type: Array,
        required: true,
    },
})

const emits = defineEmits([
    'add-tasks',
    'update:total-expect-time',
    'update:cache-add-form-folder',
])
const { covertPomorodoToTime } = useCovertBetweenTimeAndPomorodo()
const { updateTotalTimeByPopUp, counts } = useUpdateTotalTimeByPopUp({
    covertPomorodoToTime,
    pomorodoTime: props.pomorododoTime,
})

function useUpdateTotalTimeByPopUp({ covertPomorodoToTime, pomorodoTime }) {
    const counts = ref(0)
    const updateTotalTimeByPopUp = () => {
        emits(
            'update:total-expect-time',
            covertPomorodoToTime({
                pomorodoTime: pomorodoTime,
                pomorodo: counts.value,
            })
        )
        counts.value = 0
    }

    return { counts, updateTotalTimeByPopUp }
}
</script>

<template>
    <form class="home-add-task" @submit.prevent="$emit('add-tasks')">
        <button class="add-task-button home-add-task-button" type="submit">
            <img src="@/assets/images/add--v1.png" width="22" />
        </button>

        <div class="add-task-input">
            <!-- slot -->
            <slot name="name"></slot>
        </div>
        <section class="add-task-watch">
            <!-- slot -->
            <slot name="clocks"></slot>
            <div>
                <BasePopover width="200px">
                    <template #button>
                        <button
                            class="arrow home-add-task-button"
                            type="button"
                        >
                            <img
                                src="@/assets/images/external-arrow-arrows-dreamstale-lineal-dreamstale-5.png"
                                width="12"
                            />
                        </button>
                    </template>
                    <template #model="slotProps">
                        <form>
                            <BaseInput
                                id="pomorodo-cache-add-form"
                                v-model:value.number="counts"
                                class="number-input"
                                type="number"
                                placeholder="輸入數字"
                                min="0"
                                max="30"
                            >
                            </BaseInput>
                            <section class="mention-check">
                                <BaseButton
                                    color="primary"
                                    @click.prevent="
                                        updateTotalTimeByPopUp(),
                                            slotProps.close()
                                    "
                                >
                                    確定
                                </BaseButton>
                                <BaseButton @click.prevent="slotProps.close()">
                                    取消
                                </BaseButton>
                            </section>
                        </form>
                    </template>
                </BasePopover>
            </div>
        </section>
        <div class="add-task-line"></div>
        <BasePopover width="200px">
            <template #button>
                <button
                    class="add-task-color home-add-task-button"
                    type="button"
                >
                    <img src="@/assets/images/circled-dot.png" width="18" />
                </button>
            </template>
            <template #model="slotProps">
                <HomeDropdownConfirm
                    :contents="fileTypes"
                    :value="cacheAddForm.folder"
                    name="add-task-file-name"
                    @update:value="
                        $emit('update:cache-add-form-folder', $event),
                            slotProps.close()
                    "
                />
            </template>
        </BasePopover>
    </form>
</template>

<style scoped lang="scss">
.home-add-task {
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;

    background-color: $white-1;
    box-shadow: 0px 0px 4px $gray-1;
    border-radius: 4px;
    margin-bottom: 24px;

    & > *:not(:last-child) {
        margin-right: 8px;
    }
}

.home-add-task-button {
    padding: 2px;

    border-radius: 4px;
    transition: all 0.3s ease;
    background-color: $white-1;
    font-size: 0;

    &:hover {
        background-color: $gray-0;
    }
}

.home-add-task .add-task-button {
    flex: 0 1 auto;
}

.home-add-task .add-task-input {
    flex: 1 1 auto;
}

.home-add-task .add-task-watch {
    display: flex;
    align-items: center;

    .arrow {
        padding: 7px;
        position: relative;
        .pomorodo-counter {
            position: absolute;
            top: 100%;
            left: 0px;
        }
    }
}

.home-add-task .add-task-line {
    flex: 0 1 1px;
    align-self: stretch;

    background-color: $gray-1;
}

.home-add-task .add-task-arrow {
    flex: 0 1 auto;
    /* 第二層 flex */
    display: flex;
    justify-content: center;
    align-items: center;
}

.number-input {
    margin-bottom: 12px;
}

.mention-check {
    display: flex;
    justify-content: space-between;
}
</style>
