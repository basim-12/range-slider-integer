const range_slider_integer = require('..')

const opts = { min:1, max:10 }
const rsi = range_slider_integer(opts)

document.body.append(rsi)