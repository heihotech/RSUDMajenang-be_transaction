module.exports = {
  BuildMeta: () => {},
  BuildError: () => {},
  RespJSONOk: (data = {}, meta = {}) => {
    return {
      data: data ? data : {},
      meta,
    }
  },
  RespJSONError: (err) => {
    if (typeof err === 'object') {
      return {
        error: err.message !== '' ? err.message : err,
      }
    } else {
      return {
        error: {
          message: err,
        },
      }
    }
  },
}
