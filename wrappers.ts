import type {NextApiRequest, NextApiResponse} from "next"

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

type APIHandler<Request extends NextApiRequest> = (req: Request, res: NextApiResponse) => Promise<any>;

type Func<PrevousRequest extends NextApiRequest, NextRequest extends NextApiRequest> = (next: APIHandler<NextRequest>) => APIHandler<PrevousRequest>;

// type wrap1 = <T>(wf: T) => T
// type wrap2 = <T>(mw1: Func, wf: T) => T
// type wrap3 = <T>(mw1: Func, mw2: Func, wf: T) => T
// type wrap4 = <T>(mw1: Func, mw2: Func, mw3: Func, wf: T) => T
// type wrap5 = <T>(mw1: Func, mw2: Func, mw3: Func, mw4: Func, wf: T) => T
// type wrap6 = <T>(mw1: Func, mw2: Func, mw3: Func, mw4: Func, mw5: Func, wf: T) => T
// type wrap7 = <T>(mw1: Func, mw2: Func, mw3: Func, mw4: Func, mw5: Func, mw6: Func, wf: T) => T

type wrap2 = <Request extends NextApiRequest>(middlewares: [Func<NextApiRequest, Request>], handler: APIHandler<Request>) => APIHandler<Request>;

type wrap3 = <Request extends NextApiRequest, Request2 extends Request>(middlewares: [
  Func<NextApiRequest, Request>,
  Func<Request, Request2>
], handler: APIHandler<Request2>) => APIHandler<Request2>;

type Wrappers = wrap2 | wrap3

export const wrappers: wrap3 = (middlewares, handler) => {
  let lastWrappedFunction = handler;
  for (const middleware of middlewares) {
    lastWrappedFunction = middleware(lastWrappedFunction as any)
  }

  return lastWrappedFunction
}

export default wrappers;
