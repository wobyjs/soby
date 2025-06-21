export const DEBUGGER = { debug: false }

export class Stack extends Error {
    constructor(message: string) {
        super(message)
        this.name = "Stack" // Change the error class name
        Object.setPrototypeOf(this, Stack.prototype) // Ensure correct prototype chain
    }
}



export const callStack = (msg?: string) => {
    if (!DEBUGGER.debug)
        return undefined

    return new Stack(msg ?? 'Call Stack')
}