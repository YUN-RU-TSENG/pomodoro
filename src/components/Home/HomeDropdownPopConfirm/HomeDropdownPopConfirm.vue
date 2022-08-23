<script setup></script>

<template>
    <BasePopover class="home-dropdown" style="width: 160px">
        <label for="one" class="dropdown-item">
            <input id="one" type="radio" name="select" />
            <div class="box">
                <div class="color"></div>
                <p class="content">文字內容</p>
                <img
                    src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/000000/external-checked-interface-dreamstale-lineal-dreamstale.png"
                    alt=""
                    width="12"
                    class="checked"
                />
            </div>
        </label>
        <label for="two" class="dropdown-item">
            <input id="two" type="radio" name="select" />
            <div class="box">
                <div class="color"></div>
                <p class="content">文字內容</p>
                <img
                    src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/000000/external-checked-interface-dreamstale-lineal-dreamstale.png"
                    alt=""
                    width="12"
                    class="checked"
                />
            </div>
        </label>
        <label for="three" class="dropdown-item">
            <input id="three" type="radio" name="select" />
            <div class="box">
                <div class="color"></div>
                <p class="content">文字內容</p>
                <img
                    src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/000000/external-checked-interface-dreamstale-lineal-dreamstale.png"
                    alt=""
                    width="12"
                    class="checked"
                />
            </div>
        </label>
    </BasePopover>
</template>

<style scoped lang="scss">
    .home-dropdown {
    }

    .home-dropdown .dropdown-item {
        input {
            display: none;
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
            background-color: $red-2;
        }

        .content {
            font-size: 14px;
            line-height: 21px;
        }

        .checked {
            visibility: collapse;
            margin-left: auto;
        }

        input:checked ~ .box .checked {
            visibility: visible;
        }
    }
</style>
