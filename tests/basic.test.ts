import test from "ava"
import wrappers from "../wrappers"

test("test wrappers", async (t) => {
  const mw1 = (next) => (req, res) => {
    next(req as { mw1_artifact: 1 }, res)
  }

  const mw2 = (next) => (req, res) => {
    next(req as { mw2_artifact: 1 }, res)
  }

  wrappers(mw1, mw2, (req, res) => {
    req
  })
})
