import type { NextApiRequest as Req, NextApiResponse as Res } from "next"
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

export type Middleware<T, Dep = {}> = (
  next: (req: Req & Dep & T, res: Res) => any
) => (req: Req & Dep & T, res: Res) => any

// Safer Middleware requires the use of extendRequest to ensure that the
// new context (T) was actually added to the request. It's kind of annoying
// to use in practice, so we don't use it for our Wrappers (yet)
export type SaferMiddleware<T, Dep = {}> = (
  next: (req: Req & Dep & T, res: Res) => any
) => (req: Req & Dep, res: Res) => any

export const extendRequest = <T extends Req, K>(req: T, merge: K): T & K => {
  for (const [key, v] of Object.entries(merge)) {
    ;(req as any)[key] = v
  }
  return req as any
}

type Wrappers1 = <Mw1RequestContext, Mw1Dep>(
  mw1: Middleware<Mw1RequestContext, Mw1Dep>,
  endpoint: (req: Req & Mw1RequestContext, res: Res) => any
) => (req: Req, res: Res) => any

type Wrappers2 = <
  Mw1RequestContext extends Mw2Dep,
  Mw1Dep,
  Mw2RequestContext,
  Mw2Dep
>(
  mw1: Middleware<Mw1RequestContext, Mw1Dep>,
  mw2: Middleware<Mw2RequestContext, Mw2Dep>,
  endpoint: (req: Req & Mw1RequestContext & Mw2RequestContext, res: Res) => any
) => (req: Req, res: Res) => any

// TODO figure out how to do a recursive definition, or one that simplifies
// these redundant wrappers

type Wrappers3 = <
  Mw1RequestContext extends Mw2Dep,
  Mw1Dep,
  Mw2RequestContext,
  Mw2Dep,
  Mw3RequestContext,
  Mw3Dep
>(
  mw1: Middleware<Mw1RequestContext, Mw1Dep>,
  mw2: Middleware<Mw2RequestContext, Mw2Dep>,
  mw3: Middleware<
    Mw3RequestContext,
    Mw1RequestContext & Mw2RequestContext extends Mw3Dep ? Mw3Dep : never
  >,
  endpoint: (
    req: Req & Mw1RequestContext & Mw2RequestContext & Mw3RequestContext,
    res: Res
  ) => any
) => (req: Req, res: Res) => any

type Wrappers4 = <
  Mw1RequestContext extends Mw2Dep,
  Mw1Dep,
  Mw2RequestContext,
  Mw2Dep,
  Mw3RequestContext,
  Mw3Dep,
  Mw4RequestContext,
  Mw4Dep
>(
  mw1: Middleware<Mw1RequestContext, Mw1Dep>,
  mw2: Middleware<Mw2RequestContext, Mw2Dep>,
  mw3: Middleware<
    Mw3RequestContext,
    Mw1RequestContext & Mw2RequestContext extends Mw3Dep ? Mw3Dep : never
  >,
  mw4: Middleware<
    Mw4RequestContext,
    Mw1RequestContext & Mw2RequestContext & Mw3RequestContext extends Mw4Dep
      ? Mw4Dep
      : never
  >,
  endpoint: (
    req: Req & Mw1RequestContext &
      Mw2RequestContext &
      Mw3RequestContext &
      Mw4RequestContext,
    res: Res
  ) => any
) => (req: Req, res: Res) => any

type Wrappers5 = <
  Mw1RequestContext extends Mw2Dep,
  Mw1Dep,
  Mw2RequestContext,
  Mw2Dep,
  Mw3RequestContext,
  Mw3Dep,
  Mw4RequestContext,
  Mw4Dep,
  Mw5RequestContext,
  Mw5Dep
>(
  mw1: Middleware<Mw1RequestContext, Mw1Dep>,
  mw2: Middleware<Mw2RequestContext, Mw2Dep>,
  mw3: Middleware<
    Mw3RequestContext,
    Mw1RequestContext & Mw2RequestContext extends Mw3Dep ? Mw3Dep : never
  >,
  mw4: Middleware<
    Mw4RequestContext,
    Mw1RequestContext & Mw2RequestContext & Mw3RequestContext extends Mw4Dep
      ? Mw4Dep
      : never
  >,
  mw5: Middleware<
    Mw5RequestContext,
    Mw1RequestContext &
      Mw2RequestContext &
      Mw3RequestContext &
      Mw4RequestContext extends Mw5Dep
      ? Mw5Dep
      : never
  >,
  endpoint: (
    req: Req & Mw1RequestContext &
      Mw2RequestContext &
      Mw3RequestContext &
      Mw4RequestContext &
      Mw5RequestContext,
    res: Res
  ) => any
) => (req: Req, res: Res) => any

type Wrappers6 = <
  Mw1RequestContext extends Mw2Dep,
  Mw1Dep,
  Mw2RequestContext,
  Mw2Dep,
  Mw3RequestContext,
  Mw3Dep,
  Mw4RequestContext,
  Mw4Dep,
  Mw5RequestContext,
  Mw5Dep,
  Mw6RequestContext,
  Mw6Dep
>(
  mw1: Middleware<Mw1RequestContext, Mw1Dep>,
  mw2: Middleware<Mw2RequestContext, Mw2Dep>,
  mw3: Middleware<
    Mw3RequestContext,
    Mw1RequestContext & Mw2RequestContext extends Mw3Dep ? Mw3Dep : never
  >,
  mw4: Middleware<
    Mw4RequestContext,
    Mw1RequestContext & Mw2RequestContext & Mw3RequestContext extends Mw4Dep
      ? Mw4Dep
      : never
  >,
  mw5: Middleware<
    Mw5RequestContext,
    Mw1RequestContext &
      Mw2RequestContext &
      Mw3RequestContext &
      Mw4RequestContext extends Mw5Dep
      ? Mw5Dep
      : never
  >,
  mw6: Middleware<
    Mw6RequestContext,
    Mw1RequestContext &
      Mw2RequestContext &
      Mw3RequestContext &
      Mw4RequestContext &
      Mw5RequestContext extends Mw6Dep
      ? Mw6Dep
      : never
  >,
  endpoint: (
    req: Req & Mw1RequestContext &
      Mw2RequestContext &
      Mw3RequestContext &
      Mw4RequestContext &
      Mw5RequestContext &
      Mw6RequestContext,
    res: Res
  ) => any
) => (req: Req, res: Res) => any

type Wrappers7 = <
  Mw1RequestContext extends Mw2Dep,
  Mw1Dep,
  Mw2RequestContext,
  Mw2Dep,
  Mw3RequestContext,
  Mw3Dep,
  Mw4RequestContext,
  Mw4Dep,
  Mw5RequestContext,
  Mw5Dep,
  Mw6RequestContext,
  Mw6Dep,
  Mw7RequestContext,
  Mw7Dep
>(
  mw1: Middleware<Mw1RequestContext, Mw1Dep>,
  mw2: Middleware<Mw2RequestContext, Mw2Dep>,
  mw3: Middleware<
    Mw3RequestContext,
    Mw1RequestContext & Mw2RequestContext extends Mw3Dep ? Mw3Dep : never
  >,
  mw4: Middleware<
    Mw4RequestContext,
    Mw1RequestContext & Mw2RequestContext & Mw3RequestContext extends Mw4Dep
      ? Mw4Dep
      : never
  >,
  mw5: Middleware<
    Mw5RequestContext,
    Mw1RequestContext &
      Mw2RequestContext &
      Mw3RequestContext &
      Mw4RequestContext extends Mw5Dep
      ? Mw5Dep
      : never
  >,
  mw6: Middleware<
    Mw6RequestContext,
    Mw1RequestContext &
      Mw2RequestContext &
      Mw3RequestContext &
      Mw4RequestContext &
      Mw5RequestContext extends Mw6Dep
      ? Mw6Dep
      : never
  >,
  mw7: Middleware<
    Mw7RequestContext,
    Mw1RequestContext &
      Mw2RequestContext &
      Mw3RequestContext &
      Mw4RequestContext &
      Mw5RequestContext &
      Mw6RequestContext extends Mw7Dep
      ? Mw7Dep
      : never
  >,
  endpoint: (
    req: Req & Mw1RequestContext &
      Mw2RequestContext &
      Mw3RequestContext &
      Mw4RequestContext &
      Mw5RequestContext &
      Mw6RequestContext &
      Mw7RequestContext,
    res: Res
  ) => any
) => (req: Req, res: Res) => any

type Wrappers = Wrappers1 &
  Wrappers2 &
  Wrappers3 &
  Wrappers4 &
  Wrappers5 &
  Wrappers6 &
  Wrappers7

export const wrappers: Wrappers = (...wrappersArgs: any[]) => {
  const wrappedFunction = wrappersArgs[wrappersArgs.length - 1]
  const mws = wrappersArgs.slice(0, -1)

  let lastWrappedFunction = wrappedFunction
  for (let i = mws.length - 1; i >= 0; i--) {
    lastWrappedFunction = (mws[i] as any)(lastWrappedFunction)
  }

  return lastWrappedFunction
}

export default wrappers
