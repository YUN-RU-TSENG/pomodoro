export function useCovertBetweenTimeAndTomato() {
    const covertTimeToTomato = ({ time, tomatoTime }) => {
        return time / tomatoTime
    }

    const covertTomatoToTime = ({ tomatoTime, tomato }) => {
        return tomatoTime * tomato
    }

    return {
        covertTimeToTomato,
        covertTomatoToTime,
    }
}
