module.exports = (service) => {
  require('./role')(service)
  require('./user')(service)
  require('./transaction')(service)
}
