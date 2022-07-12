import test from "ava"
import { wrappers, Middleware } from "../wrappers"

test("test wrappers", async (t) => {
  const mw1: Middleware<{ mw1_artifact: number }> = (next) => (req, res) => {
    next(req as { mw1_artifact: 1 }, res)
  }

  const mw2: Middleware<{ mw2_artifact: number }> = (next) => (req, res) => {
    next(req as { mw2_artifact: 1 }, res)
  }

  const mw3: Middleware<{ mw3_artifact: number }, { mw1_artificat: number }> =
    (next) => (req, res) => {
      next(req as { mw3_artifact: 1 }, res)
    }

  wrappers(mw1, (req, res) => {
    req
  })

  wrappers(mw1, mw2, (req, res) => {
    req
  })

  wrappers(mw1, mw2, mw3, (req, res) => {
    req
  })
})
