<script setup></script>

<template>
    <section class="home-time-sum">
        <div class="time-sum-item">
            <h3>9</h3>
            <p>預估時間</p>
        </div>
        <div class="time-sum-item">
            <h3>9</h3>
            <p>待完成任務</p>
        </div>
        <div class="time-sum-item">
            <h3>9</h3>
            <p>已專注時間</p>
        </div>
        <div class="time-sum-item">
            <h3>9</h3>
            <p>已完成任務</p>
        </div>
    </section>
</template>

<style scoped lang="scss">
    .home-time-sum {
        display: flex;
        padding: 10px;

        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0px 0px 4px #cfcfcf;
    }

    .time-sum-item {
        flex: 0 1 25%;
        text-align: center;

        h3 {
            font-size: 20px;
            line-height: 28px;
            color: #eb615a;
        }

        p {
            font-size: 14px;
            line-height: 21px;
            color: #7c7c7c;
        }
    }
</style>
