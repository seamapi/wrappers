# (NextJS) Middleware Wrappers

For the common use case of wrapping a NextJS endpoint with methods that act as middleware.

Wraps a function in layers of other functions, while preserving the input/output
type. The output of wrappers will always have the type of it's last parameter
(the wrapped function)

This function turns this type of composition...

```ts
logger.withContext("somecontext")(
  async (a, b) => {
    return a
  }
)
```

Into...

```ts
wrappers(
  logger.withContext("somecontext"),
  async (a, b) => {
    return a
  }
)
```

Having this as a utility method helps preserve types, which otherwise can get
messed up by the middlewares. It also can make the code cleaner where there are
multiple wrappers.

```ts
const mw1: Middleware<{ mw1_artifact: number }> = (next) => (req, res) => {
  req.mw1_artifact = 1
  next(req, res)
}

const mw2: Middleware<{ mw2_artifact: number }> = (next) => (req, res) => {
  req.mw2_artifact = 2
  next(req, res)
}

const mw3: Middleware<{ mw3_artifact: number }, { mw1_artifact: number }> =
  (next) => (req, res) => {
    req.mw1_artifact // this is defined because of the dependency def
    next(req, res)
  }

wrappers(mw1, mw2, mw3, (req, res) => {
  req
})
```

## Installation

## Automatic Deploy to NPM

To have your PR be automatically deployed to NPM, make sure to tag your commit messages with the [Angular JS commit message format](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.t7ifoyph8bd3).

i.e.
| Commit message | Release type |
| -------------- | ------------ |
| fix(pencil): stop graphite breaking when too much pressure applied | Fix Release |
| feat(pencil): add 'graphiteWidth' option	| Feature Release |
| perf(pencil): remove graphiteWidth option
| BREAKING CHANGE: The graphiteWidth option has been removed. The default graphite width of 10mm is always used for performance reasons. | Breaking Release (Note that the BREAKING CHANGE: token must be in the footer of the commit) |
