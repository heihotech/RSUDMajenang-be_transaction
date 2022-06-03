module.exports = (services) => {
  require('./transaction')(services)
  require('./rawinformation')(services)
}
