module.exports = (services) => {
  require('./user')(services)
  require('./role')(services)
  require('./permission')(services)
  require('./transaction')(services)
  require('./rawinformation')(services)
}
