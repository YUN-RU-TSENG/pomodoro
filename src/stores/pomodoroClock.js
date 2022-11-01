import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { useToggleComponent } from '@/composables/useToggleComponent'
import { usePomodoroSetting } from '@/stores/pomodoroSetting'
import { useTasksStore } from '@/stores/tasks'

export const usePomodoroClockStore = defineStore('pomodoroClock', () => {
    // pomodoroSettingStore
    const pomodoroSettingStore = usePomodoroSetting()

    // tasksStore
    const tasksStore = useTasksStore()

    // pomodoro timer
    const timer = ref({
        pomodoro: 45 * 60, // pomodoro 時長(秒)
        breakTime: 5 * 60, // breakTime 時長(秒)
        longBreakTime: 15 * 60, // longBreakTime 時長(秒)
        longBreakInterval: 4, // longBreakTime 間隔回數
        currentInterval: 0, // 當前回數
        isStart: false, // 是否正在倒數
        mode: 'pomodoro', // 當前模式，分為 pomodoro、longBreakTime、breakTime
        countDownTime: null, // 倒數計時的時間(秒)
    })

    const {
        visible: isShowPomodoroModal,
        open: openPomodoroModal,
        close: closePomodoroModal,
        toggle: togglePomodoroModal,
    } = useToggleComponent()

    // 選擇任務 id
    const selectedTaskId = ref('')

    // 選擇任務
    const { selectedTask } = useSelectedTask({ tasksStore, selectedTaskId })

    // interval ID
    const intervalId = ref(null)

    // 開始 Pomodoro
    const { startPomodoro } = useStartPomodoro({
        intervalId,
        timer,
        selectedTask,
        tasksStore,
        pomodoroSettingStore,
    })

    // 暫停 Pomodoro
    const { stopPomodoro } = useStopPomodoro({ intervalId, timer })

    // 終止 Pomodoro
    const { breakPomodoro } = useBreakPomodoro({
        intervalId,
        timer,
        selectedTaskId,
        isShowPomodoroModal,
    })

    // 當選擇任一 task，自動開始 Pomodoro
    useWatchTaskToAutoStartPomodoro({
        startPomodoro,
        timer,
        selectedTaskId,
        intervalId,
        isShowPomodoroModal,
        pomodoroSettingStore,
    })

    return {
        selectedTaskId,
        selectedTask,
        timer,
        startPomodoro,
        stopPomodoro,
        breakPomodoro,
        isShowPomodoroModal,
        openPomodoroModal,
        closePomodoroModal,
        togglePomodoroModal,
    }
})

/**
 * 當有選擇 task 時自動開始 pomodoro
 */
function useWatchTaskToAutoStartPomodoro({
    startPomodoro,
    timer,
    selectedTaskId,
    intervalId,
    isShowPomodoroModal,
    pomodoroSettingStore,
}) {
    watch(selectedTaskId, (newSelectedTaskId, oldSelectedTaskId) => {
        // 是否正在加載番茄鐘用戶設置，有則跳出
        if (pomodoroSettingStore.isLoadingPomodoroSettingGet) return

        // 是否成功預加載番茄鐘用戶設置，無則跳出
        if (pomodoroSettingStore.errorOfPomodoroSettingGet) return

        // 將 timer 依照用戶預設設置
        timer.value = {
            ...timer.value,
            pomodoro: pomodoroSettingStore.pomodoroSettings.pomodoro,
            breakTime: pomodoroSettingStore.pomodoroSettings.breakTime,
            longBreakTime: pomodoroSettingStore.pomodoroSettings.longBreakTime,
            longBreakInterval:
                pomodoroSettingStore.pomodoroSettings.longBreakInterval,
        }

        // 先前有選擇任務 -->
        if (oldSelectedTaskId) {
            // - 1. interval 清空
            clearInterval(intervalId.value)

            // - 2. 重置相關 pomodoro - countDown、isStart
            timer.value = {
                ...timer.value,
                mode: 'pomodoro',
                isStart: false,
                countDownTime: null,
            }
        }
        // <-- 先前有選擇任務

        // 當前有選擇任務 -->
        if (newSelectedTaskId) {
            // - 1. 設置 mode 為 pomodoro 的 timer countDownTime
            timer.value = {
                ...timer.value,
                mode: 'pomodoro',
                countDownTime: timer.value.pomodoro,
            }

            // - 2. 自動開始 startPomodoro
            startPomodoro()

            // - 3. 開啟番茄鐘面板，不在自動開始內開啟面板，因為只有透過選擇任務開啟番茄鐘時，會自動開啟面板
            isShowPomodoroModal.value = true
        }
        // <-- 當前有選擇任務
    })
}

/**
 * 開始 pomodoro
 */
function useStartPomodoro({
    intervalId,
    timer,
    selectedTask,
    tasksStore,
    pomodoroSettingStore,
}) {
    const startPomodoro = () => {
        timer.value.isStart = true
        const countDownDate = dayjs().add(timer.value.countDownTime, 'second')

        intervalId.value = setInterval(() => {
            timer.value.countDownTime = countDownDate.diff(dayjs(), 'second')

            // --未倒數完成--
            // 不執行下方程式碼
            if (timer.value.countDownTime > 0) return

            // --倒數完成--
            // 清除當前倒數
            clearInterval(intervalId.value)

            // 當當前 mode 為 pomodoro，增加執行回數
            if (timer.value.mode === 'pomodoro')
                timer.value.currentInterval += 1

            // 是否切換長休息
            const isLongBreakInterval =
                timer.value.currentInterval % timer.value.longBreakInterval ===
                0

            if (isLongBreakInterval) {
                // 更新下次計時模式
                timer.value = {
                    ...timer.value,
                    mode: 'longBreakTime',
                    countDownTime: timer.value.longBreakTime,
                    isStart: false,
                }
            } else if (timer.value.mode === 'pomodoro') {
                // 更新用戶番茄任務時間
                tasksStore.updateTask({
                    ...selectedTask.value,
                    totalSpendTime:
                        selectedTask.value.totalSpendTime +
                        pomodoroSettingStore.pomodoroSettings.pomodoro,
                })
                // 更新下次計時模式
                timer.value = {
                    ...timer.value,
                    mode: 'breakTime',
                    countDownTime: timer.value.breakTime,
                    isStart: false,
                }
            } else {
                // 更新下次計時模式
                timer.value = {
                    ...timer.value,
                    mode: 'pomodoro',
                    countDownTime: timer.value.pomodoro,
                    isStart: false,
                }
            }

            // 依據用戶設置判斷是否自動執行下一次的 pomodoro
            if (pomodoroSettingStore.pomodoroSettings.autoContinue) {
                console.log('start')
                startPomodoro()
            }
        }, 300)
    }

    return {
        startPomodoro,
    }
}

/**
 * 停止當前 pomodoro
 */
function useStopPomodoro({ intervalId, timer }) {
    const stopPomodoro = () => {
        clearInterval(intervalId.value)

        timer.value = {
            ...timer.value,
            isStart: false,
        }
    }

    return {
        stopPomodoro,
    }
}

/**
 * 終止當前 pomodoro
 */
function useBreakPomodoro({
    intervalId,
    timer,
    selectedTaskId,
    isShowPomodoroModal,
}) {
    const breakPomodoro = () => {
        clearInterval(intervalId.value)

        timer.value = {
            ...timer.value,
            mode: 'pomodoro',
            countDownTime: timer.value.pomodoro,
            isStart: false,
        }

        selectedTaskId.value = ''

        isShowPomodoroModal.value = false
    }

    return {
        breakPomodoro,
    }
}

/**
 * 依照 selectedTaskId 返回 task 狀態
 */
function useSelectedTask({ tasksStore, selectedTaskId }) {
    const selectedTask = computed(() => {
        let result = tasksStore.tasks.filter(
            (item) => item.id === selectedTaskId.value
        )
        return result[0] ?? {}
    })

    return { selectedTask }
}
