export const DEBUGGER = { debug: false, test: false }

export class Stack extends Error {
    constructor(message = '', startIndex = 0) {
        super(message)
        this.name = "Stack" // Change the error class name
        Object.setPrototypeOf(this, Stack.prototype) // Ensure correct prototype chain

        if (this.stack) {
            const stackLines = this.stack.split('\n')
            const header = stackLines[0] // usually "Stack: message"
            const body = stackLines.slice(1 + startIndex) // drop frames before `startIndex`
            this.stack = [header, ...body].join('\n')
        }
    }
}



export const callStack = (msg?: string) => {
    if (!DEBUGGER.debug)
        return undefined

    return new Stack(msg ?? 'Call Stack')
}