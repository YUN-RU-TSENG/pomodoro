// 轉換 pomodoro 與 second
export function useCovertBetweenTimeAndPomodoro() {
    // 轉換 second 為 pomodoro 數量（取到小數點一位）
    const covertTimeToPomodoro = ({ time, pomodoroTime }) => {
        return Math.floor((time / pomodoroTime) * 10) / 10
    }

    // 轉換 pomodoro 為 second
    const covertPomodoroToTime = ({ pomodoroTime, pomodoro }) => {
        return Math.floor(pomodoroTime * pomodoro)
    }

    return {
        covertTimeToPomodoro,
        covertPomodoroToTime,
    }
}
