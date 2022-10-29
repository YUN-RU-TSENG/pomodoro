<script setup>
/*========== component props ========== */

defineProps({
    theSumOfExpectTimeOfTask: { type: Number, required: true },
    theSumOfSpendTimeOfTask: { type: Number, required: true },
    theSumOfNumberOfUnFinishTasks: { type: Number, required: true },
    theSumOfNumberOfFinishTasks: { type: Number, required: true },
})
</script>

<template>
    <section class="home-time-sum">
        <div class="time-sum-item">
            <h3>{{ Math.floor(theSumOfExpectTimeOfTask / 60 / 60) }}</h3>
            <p>預估時間 h</p>
        </div>
        <div class="time-sum-item">
            <h3>{{ theSumOfNumberOfUnFinishTasks }}</h3>
            <p>待完成任務</p>
        </div>
        <div class="time-sum-item">
            <h3>{{ Math.floor(theSumOfSpendTimeOfTask / 60 / 60) }}</h3>
            <p>已專注時間 h</p>
        </div>
        <div class="time-sum-item">
            <h3>{{ theSumOfNumberOfFinishTasks }}</h3>
            <p>已完成任務</p>
        </div>
    </section>
</template>

<style scoped lang="scss">
.home-time-sum {
    display: flex;
    padding: 10px;

    background-color: $white-1;
    border-radius: 4px;
    box-shadow: 0px 0px 4px $gray-1;
}

.time-sum-item {
    flex: 0 1 25%;
    text-align: center;

    h3 {
        font-size: 20px;
        line-height: 28px;
        color: $green-1;
    }

    p {
        font-size: 14px;
        line-height: 21px;
        color: $gray-3;
    }
}
</style>
