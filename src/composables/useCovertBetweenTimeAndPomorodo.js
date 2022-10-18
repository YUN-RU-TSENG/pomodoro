export function useCovertBetweenTimeAndPomorodo() {
    const covertTimeToPomorodo = ({ time, pomorodoTime }) => {
        return Math.floor((time / pomorodoTime) * 10) / 10
    }

    const covertPomorodoToTime = ({ pomorodoTime, pomorodo }) => {
        return pomorodoTime * pomorodo
    }

    return {
        covertTimeToPomorodo,
        covertPomorodoToTime,
    }
}
