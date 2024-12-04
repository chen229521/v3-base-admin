import { Ref, ref } from 'vue'

type BooleanReturn = {
    setBool: (value: boolean) => void
    setTrue: () => void
    setFalse: () => void
    toggle: () => void
}
export default function useBoolean(initValue = false): BooleanReturn & { bool: Ref<boolean> } {
    const bool = ref(initValue)

    function setBool(value: boolean) {
        bool.value = value
    }

    function setTrue() {
        setBool(true)
    }

    function setFalse() {
        setBool(false)
    }

    function toggle() {
        setBool(!bool.value)
    }

    return {
        bool,
        setBool,
        setTrue,
        setFalse,
        toggle
    }
}
