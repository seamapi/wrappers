# (NextJS) Middleware Wrappers

For the common use case of wrapping a NextJS endpoint with methods that act as middleware.

Wraps a function in layers of other functions, while preserving the input/output
type. The output of wrappers will always have the type of its last parameter
(the wrapped function)

This function turns this type of composition...

```ts
withDatabase(
  logger.withContext("somecontext")(async (a, b) => {
    return a
  })
)
```

Into...

```ts
wrappers(withDatabase, logger.withContext("somecontext"), async (a, b) => {
  return a
})
```

Having this as a utility method helps preserve types, which otherwise can get
messed up by the middlewares. It also can make the code cleaner where there are
multiple wrappers.

## EXAMPLES

In the context of request middleware you might write something like this...

```ts
const withRequestLoggingMiddleware = (next) => async (req, res) => {
  console.log(`GOT REQUEST ${req.method} ${req.path}`)
  return next(req, res)
}
```

Here's an example of a wrapper that takes some parameters...

```ts
const withLoggedArguments =
  (logPrefix: string) =>
  (next) =>
  async (...funcArgs) => {
    console.log(logPrefix, ...funcArgs)
    return next(...funcArgs)
  }
```

## Installation

## Automatic Deploy to NPM

To have your PR be automatically deployed to NPM, make sure to tag your commit messages with the [Angular JS commit message format](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.t7ifoyph8bd3)
