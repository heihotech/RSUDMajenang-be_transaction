module.exports = (services) => {
  require('./permission')(services)
  require('./role')(services)
  require('./transaction')(services)
  require('./rawinformation')(services)
}
