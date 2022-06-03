module.exports = {
  ParseJOIError: (err) => {
    console.error(err)

    if (err.message) {
      return err
    }

    const [detail] = err.details
    return detail.message
  },
}
