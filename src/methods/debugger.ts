export const DEBUGGER = { debug: false }

export const callStack = (msg?: string) => {
    if (!DEBUGGER.debug)
        return undefined

    return new Error(msg ?? 'Call Stack')
}