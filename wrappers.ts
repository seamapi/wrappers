/*

Wraps a function in layers of other functions, while preserving the input/output
type. The output of wrappers will always have the type of it's last parameter
(the wrapped function)

This function turns this type of composition...

logger.withContext("somecontext")(
  async (a, b) => {
    return a
  }
)

Into...

wrappers(
  logger.withContext("somecontext"),
  async (a, b) => {
    return a
  }
)

Having this as a utility method helps preserve types, which otherwise can get
messed up by the middlewares. It also can make the code cleaner where there are
multiple wrappers.

## EXAMPLES

In the context of request middleware you might write something like this...

const withRequestLoggingMiddleware = (next) => async (req, res) => {
  console.log(`GOT REQUEST ${req.method} ${req.path}`)
  return next(req, res)
}

Here's an example of a wrapper that takes some parameters...

const withLoggedArguments =
    (logPrefix: string) =>
    (next) =>
    async (...funcArgs) => {
      console.log(logPrefix, ...funcArgs)
      return next(...funcArgs)
    }

*/

// TODO middleware should have a required type
type wrap1 = <T>(wf: T) => T
type wrap2 = <T>(mw1: any, wf: T) => T
type wrap3 = <T>(mw1: any, mw2: any, wf: T) => T
type wrap4 = <T>(mw1: any, mw2: any, mw3: any, wf: T) => T
type wrap5 = <T>(mw1: any, mw2: any, mw3: any, mw4: any, wf: T) => T
type wrap6 = <T>(mw1: any, mw2: any, mw3: any, mw4: any, mw5: any, wf: T) => T
type wrap7 = <T>(mw1: any, mw2: any, mw3: any, mw4: any, mw5: any, mw6: any, wf: T) => T

type Wrappers = wrap1 & wrap2 & wrap3 & wrap4 & wrap5 & wrap6 & wrap7

export const wrappers: Wrappers = (...wrappersArgs) => {
  const wrappedFunction = wrappersArgs[wrappersArgs.length - 1]
  const mws = wrappersArgs.slice(0, -1)

  let lastWrappedFunction = wrappedFunction
  for (let i = mws.length - 1; i >= 0; i--) {
    lastWrappedFunction = mws[i](lastWrappedFunction)
  }

  return lastWrappedFunction
}

export default wrappers

