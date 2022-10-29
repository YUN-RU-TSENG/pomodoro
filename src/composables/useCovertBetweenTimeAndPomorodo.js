// 轉換 pomorodo 與 second
export function useCovertBetweenTimeAndPomorodo() {
    // 轉換 second 為 pomorodo 數量（取到小數點一位）
    const covertTimeToPomorodo = ({ time, pomorodoTime }) => {
        return Math.floor((time / pomorodoTime) * 10) / 10
    }

    // 轉換 pomorodo 為 second
    const covertPomorodoToTime = ({ pomorodoTime, pomorodo }) => {
        return Math.floor(pomorodoTime * pomorodo)
    }

    return {
        covertTimeToPomorodo,
        covertPomorodoToTime,
    }
}
