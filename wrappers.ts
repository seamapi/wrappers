import type { NextApiRequest, NextApiResponse } from "next"

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

type APIHandler<Request extends NextApiRequest> = (
  req: Request,
  res: NextApiResponse
) => Promise<any>

type Func<
  PrevousRequest extends NextApiRequest,
  NextRequest extends NextApiRequest
> = (next: APIHandler<NextRequest>) => APIHandler<PrevousRequest>

export function wrappers<Request extends NextApiRequest>(
  middlewares: [],
  handler: APIHandler<Request>
): APIHandler<Request>
export function wrappers<Request extends NextApiRequest>(
  middlewares: [Func<NextApiRequest, Request>],
  handler: APIHandler<Request>
): APIHandler<Request>
export function wrappers<
  Request extends NextApiRequest,
  Request2 extends Request
>(
  middlewares: [Func<NextApiRequest, Request>, Func<Request, Request2>],
  handler: APIHandler<Request2>
): APIHandler<Request2>
export function wrappers<
  Request extends NextApiRequest,
  Request2 extends Request,
  Request3 extends Request2
>(
  middlewares: [
    Func<NextApiRequest, Request>,
    Func<Request, Request2>,
    Func<Request2, Request3>
  ],
  handler: APIHandler<Request3>
): APIHandler<Request3>
export function wrappers<
  Request extends NextApiRequest,
  Request2 extends Request,
  Request3 extends Request2,
  Request4 extends Request3
>(
  middlewares: [
    Func<NextApiRequest, Request>,
    Func<Request, Request2>,
    Func<Request2, Request3>,
    Func<Request3, Request4>
  ],
  handler: APIHandler<Request4>
): APIHandler<Request4>
export function wrappers<
  Request extends NextApiRequest,
  Request2 extends Request,
  Request3 extends Request2,
  Request4 extends Request3,
  Request5 extends Request4
>(
  middlewares: [
    Func<NextApiRequest, Request>,
    Func<Request, Request2>,
    Func<Request2, Request3>,
    Func<Request3, Request4>,
    Func<Request4, Request5>
  ],
  handler: APIHandler<Request5>
): APIHandler<Request5>
export function wrappers<
  Request extends NextApiRequest,
  Request2 extends Request,
  Request3 extends Request2,
  Request4 extends Request3,
  Request5 extends Request4,
  Request6 extends Request5
>(
  middlewares: [
    Func<NextApiRequest, Request>,
    Func<Request, Request2>,
    Func<Request2, Request3>,
    Func<Request3, Request4>,
    Func<Request4, Request5>,
    Func<Request5, Request6>
  ],
  handler: APIHandler<Request6>
): APIHandler<Request6>

export function wrappers(middlewares: any[], handler: APIHandler<any>) {
  let lastWrappedFunction = handler
  for (const middleware of middlewares) {
    lastWrappedFunction = middleware(lastWrappedFunction as any)
  }

  return lastWrappedFunction
}

export default wrappers
