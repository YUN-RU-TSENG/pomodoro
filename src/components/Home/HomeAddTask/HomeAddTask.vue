<script setup>
import { ref } from 'vue'
import useCovertBetweenTimeAndTomato from '@/composables/useCovertBetweenTimeAndTomato'

const props = defineProps({
    tomatoTime: {
        type: Object,
        required: true,
    },
})

const emits = defineEmits(['add-tasks', 'update:total-expect-time'])

const { covertTomatoToTime } = useCovertBetweenTimeAndTomato()
const { updateTotalTimeByPopUp, counts } = useUpdateTotalTimeByPopUp({
    covertTomatoToTime,
    tomatoTime: props.tomatoTime,
})

function useUpdateTotalTimeByPopUp({ covertTomatoToTime, tomatoTime }) {
    const counts = ref(0)
    const updateTotalTimeByPopUp = () => {
        emits(
            'update:total-expect-time',
            covertTomatoToTime({
                tomatoTime: tomatoTime,
                tomato: counts.value,
            })
        )
        counts.value = 0
    }

    return { counts, updateTotalTimeByPopUp }
}
</script>

<template>
    <form class="home-add-task" @submit.prevent="$emit('add-tasks')">
        <button class="add-task-button" type="submit">
            <img src="@/assets/images/add--v1.png" alt="" width="22" />
        </button>

        <div class="add-task-input">
            <!-- slot -->
            <slot name="name"></slot>
        </div>
        <section class="add-task-watch">
            <!-- slot -->
            <slot name="clocks"></slot>

            <button class="arrow">
                <img
                    src="@/assets/images/external-arrow-arrows-dreamstale-lineal-dreamstale-5.png"
                    alt=""
                    width="12"
                    @click.prevent="$refs.counter.toggle()"
                />
                <HomeNumberPopConfirm
                    ref="counter"
                    v-model:value.number="counts"
                    class="tomato-counter"
                    @confirm="updateTotalTimeByPopUp(), $refs.counter.close()"
                    @cancel="$refs.counter.close()"
                />
            </button>
        </section>
        <div class="add-task-line"></div>
        <button class="add-task-color">
            <img src="@/assets/images/circled-dot.png" width="18" alt="" />
        </button>
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

    button {
        padding: 2px;

        border-radius: 4px;
        transition: all 0.3s ease;
        background-color: $white-1;
        font-size: 0;

        &:hover {
            background-color: $gray-0;
        }
    }

    & > *:not(:last-child) {
        margin-right: 8px;
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
        .tomato-counter {
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
</style>
