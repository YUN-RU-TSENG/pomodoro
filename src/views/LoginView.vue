<script setup></script>

<template>
    <div class="login">
        <div class="login-wrapper">
            <form class="login-box">
                <h3>Login</h3>
                <p class="subtitle">Tomato todo 優雅的使用待辦清單以及番茄鐘</p>
                <BaseInput></BaseInput>
                <BaseInput></BaseInput>
                <BaseButton color="red"></BaseButton>
            </form>
            <section class="login-box">
                <p>沒有帳號？ <a href="">登入</a></p>
            </section>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .login {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        color: $gray-4;

        background-color: $gray-0;
    }

    .login-box {
        width: 320px;
        margin: 0 auto;
        padding: 32px 20px;
        text-align: center;

        border-radius: 4px;
        background-color: $white-1;
        box-shadow: 0 0 4px $gray-1;

        &:not(:last-child) {
            margin-bottom: 24px;
        }

        & *:not(:last-child) {
            margin-bottom: 12px;
        }

        h3 {
            font-size: 24px;
            line-height: 36px;
            font-weight: 100;
            color: $red-2;
        }

        a {
            color: $red-2;
        }

        .subtitle {
            font-size: 12px;
            line-height: 18px;
            color: $gray-3;
        }

        .base-button {
            width: 100%;
        }
    }
</style>
