import { ref, watchEffect, computed, onBeforeUnmount } from 'vue'
import {
    computePosition,
    offset,
    flip,
    shift,
    autoUpdate,
    arrow as arrowFn,
} from '@floating-ui/dom'

export function useFloating() {
    const strategy = ref('absolute')
    const arrowStrategy = ref('absolute')
    const floating = ref(null)
    const reference = ref(null)
    const arrow = ref(null)
    const staticSide = ref(null)

    const x = ref(0)
    const y = ref(0)
    const xPX = computed(() => x.value + 'px')
    const yPX = computed(() => y.value + 'px')

    const arrowX = ref(0)
    const arrowY = ref(0)
    const arrowXPX = computed(() => arrowX.value + 'px')
    const arrowYPX = computed(() => arrowY.value + 'px')

    let cleanupAutoUpdate = null

    const stopWatchEffect = watchEffect(function startListeningPosition() {
        if (!reference.value || !floating.value || !arrow.value) return

        cleanupAutoUpdate = autoUpdate(
            reference.value,
            floating.value,
            async () => {
                const {
                    x: xValue,
                    y: yValue,
                    placement,
                    middlewareData,
                } = await computePosition(reference.value, floating.value, {
                    placement: 'bottom',
                    middleware: [
                        offset(6),
                        flip(),
                        shift(),
                        arrowFn({ element: arrow.value }),
                    ],
                })

                x.value = xValue
                y.value = yValue

                const { x: arrowXValue, y: arrowYValue } = middlewareData.arrow

                arrowX.value = arrowXValue ?? ''
                arrowY.value = arrowYValue ?? ''

                staticSide.value = {
                    top: 'bottom',
                    right: 'left',
                    bottom: 'top',
                    left: 'right',
                }[placement.split('-')[0]]
            }
        )

        stopWatchEffect()
    })

    onBeforeUnmount(() => {
        cleanupAutoUpdate()
    })

    return {
        x: xPX,
        y: yPX,
        reference,
        floating,
        strategy,
        arrow,
        arrowStrategy,
        arrowX: arrowXPX,
        arrowY: arrowYPX,
        staticSide,
    }
}
