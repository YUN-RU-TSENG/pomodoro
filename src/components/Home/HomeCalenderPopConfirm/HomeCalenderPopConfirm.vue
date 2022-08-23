<script setup></script>

<template>
    <BasePopover style="width: 216px">
        <section class="home-calender">
            <header>
                <button class="calender-arrow">
                    <img
                        src="https://img.icons8.com/material-rounded/48/000000/circled-chevron-left.png"
                        alt=""
                        width="20"
                    />
                </button>
                <h4 class="calender-years">August 2022</h4>
                <button class="calender-arrow">
                    <img
                        src="https://img.icons8.com/material-rounded/48/000000/circled-chevron-right.png"
                        alt=""
                        width="20"
                    />
                </button>
            </header>
            <main>
                <div class="week">
                    <div class="week-day">Sun</div>
                    <div class="week-day">Mon</div>
                    <div class="week-day">Tue</div>
                    <div class="week-day">Wed</div>
                    <div class="week-day">Thu</div>
                    <div class="week-day">Fri</div>
                    <div class="week-day">Sat</div>
                </div>
                <div class="date">
                    <button class="date-day">1</button>
                    <button class="date-day">2</button>
                    <button class="date-day">3</button>
                    <button class="date-day">4</button>
                    <button class="date-day">5</button>
                    <button class="date-day">6</button>
                    <button class="date-day">7</button>
                    <button class="date-day">8</button>
                    <button class="date-day">9</button>
                    <button class="date-day">10</button>
                    <button class="date-day">11</button>
                    <button class="date-day">12</button>
                    <button class="date-day">13</button>
                    <button class="date-day">14</button>
                    <button class="date-day">15</button>
                    <button class="date-day">16</button>
                    <button class="date-day">17</button>
                    <button class="date-day">18</button>
                    <button class="date-day">19</button>
                    <button class="date-day">20</button>
                    <button class="date-day">21</button>
                    <button class="date-day">22</button>
                    <button class="date-day">23</button>
                    <button class="date-day">24</button>
                    <button class="date-day">25</button>
                    <button class="date-day">26</button>
                    <button class="date-day">27</button>
                    <button class="date-day">28</button>
                    <button class="date-day">29</button>
                    <button class="date-day">30</button>
                    <button class="date-day">31</button>
                </div>
            </main>
        </section>
        <section class="mention-time">
            <BaseInput></BaseInput>
        </section>
        <section class="mention-check">
            <BaseButton></BaseButton>
            <BaseButton></BaseButton>
        </section>
    </BasePopover>
</template>

<style scoped lang="scss">
    .home-calender {
        button {
            font-size: 0;
        }
    }

    .home-calender header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        .calender-arrow {
        }

        .calender-years {
            font-size: 14px;
            line-height: 21px;
            color: $gray-3;
        }
    }
    .home-calender main {
        font-size: 12px;
        line-height: 18px;

        .week {
            margin-bottom: 12px;

            div {
                text-align: center;
                display: inline-block;
                width: 14.28%;
                padding: 6px 0;
            }
        }

        .date {
            // display: flex;
            // flex-wrap: wrap;
            margin-bottom: 12px;

            button {
                width: 14.28%;
                padding: 3px 0;

                font-size: 14px;
                line-height: 21px;
                text-align: center;
                transition: all 0.3s ease;

                border-radius: 50%;
                &:hover,
                &.active {
                    background-color: $red-2;
                    color: $white-1;
                }
            }
        }
    }

    .mention-time {
        margin-bottom: 12px;
    }
    .mention-check {
        display: flex;
        justify-content: space-between;
    }
</style>
