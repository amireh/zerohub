module.exports = function discardCarriage(string) {
  return string.replace(/\r\n/g, ' ');
}