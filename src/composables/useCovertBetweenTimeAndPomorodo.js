export function useCovertBetweenTimeAndPomorodo() {
    const covertTimeToPomorodo = ({ time, pomorodoTime }) => {
        return time / pomorodoTime
    }

    const covertPomorodoToTime = ({ pomorodoTime, pomorodo }) => {
        return pomorodoTime * pomorodo
    }

    return {
        covertTimeToPomorodo,
        covertPomorodoToTime,
    }
}
