<script setup>
// 引入用戶設置當前資料（快取）
import { usePomodoroSetting } from '@/stores/pomodoroSetting'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

const pomodoroSettingStore = usePomodoroSetting()
const { pomodoroSettings } = storeToRefs(pomodoroSettingStore)

const cachePomodoroSettings = ref({
    pomodoro: pomodoroSettings.value.pomodoro / 60, // pomodoro 時長(秒)
    breakTime: pomodoroSettings.value.breakTime / 60, // breakTime 時長(秒)
    longBreakTime: pomodoroSettings.value.longBreakTime / 60, // longBreakTime 時長(秒)
    longBreakInterval: pomodoroSettings.value.longBreakInterval, // longBreakTime 間隔回數
    autoContinue: pomodoroSettings.value.autoContinue, // 是否自動繼續 Pomodoro
})
</script>

<template>
    <FormLayout class="pomdoro-setting">
        <BaseForm
            title="用戶設置"
            text="可透過下列欄位修改蕃茄鐘設定"
            @submit-form="$emit('submit-form')"
        >
            <slot></slot>
            <BaseInput
                id="auth-login-password"
                v-model:value="cachePomodoroSettings.pomodoro"
                type="number"
                label="蕃茄鐘工作時間（分鐘）"
                min="0"
            ></BaseInput>
            <BaseInput
                id="auth-login-email"
                v-model:value="cachePomodoroSettings.breakTime"
                type="number"
                label="短休息（分鐘）"
                min="0"
            ></BaseInput>
            <BaseInput
                id="auth-login-password"
                v-model:value="cachePomodoroSettings.longBreakTime"
                type="number"
                label="長休息（分鐘）"
                min="0"
            ></BaseInput>
            <BaseInput
                id="auth-login-password"
                v-model:value="cachePomodoroSettings.longBreakInterval"
                type="number"
                label="長休息間隔回數"
                min="0"
            ></BaseInput>
            <div class="pomdoro-setting-checkbox">
                <BaseCheckbox
                    id="home-task-edit-bar-is-finish"
                    v-model:value="cachePomodoroSettings.autoContinue"
                    name="home-task-edit-bar-is-finish"
                />
                <span>是否自動倒數</span>
            </div>

            <BaseButton
                color="primary"
                @click="
                    pomodoroSettingStore.updatePomodoroSettings({
                        pomodoro: cachePomodoroSettings.pomodoro * 60,
                        breakTime: cachePomodoroSettings.breakTime * 60,
                        longBreakTime: cachePomodoroSettings.longBreakTime * 60,
                        longBreakInterval:
                            cachePomodoroSettings.longBreakInterval,
                        autoContinue: cachePomodoroSettings.autoContinue,
                    })
                "
                >儲存</BaseButton
            >
        </BaseForm>
        <BaseLoading
            v-if="pomodoroSettingStore.isLoadingPomodoroSettingsUpdate"
            text="更新用戶配置"
        />
    </FormLayout>
</template>

<style lang="scss" scoped>
.pomdoro-setting.pomdoro-setting {
    height: calc(100vh - 45px);
}

.pomdoro-setting .base-input-label {
    margin-bottom: 12px;
}

.pomdoro-setting .base-button {
    width: 100%;
}

.pomdoro-setting-checkbox {
    display: flex;
    font-size: 14px;
    line-height: 21px;
    color: $gray-3;
}
</style>
