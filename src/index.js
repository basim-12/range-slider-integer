const range = require('range-slider-basim')
const input = require('@basim.asim123/input.integer')

module.exports = range_slider_integer

function range_slider_integer (opts) {
  const state = {

  }
  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })

  const range_slider = range(opts, protocol)
  const input_integer = input(opts, protocol)

  const rsi = document.createElement('div')
  rsi.classList.add('rsi')

  const style = document.createElement('style')
  style.textContent = get_theme()

  rsi.append(range_slider, input_integer)
  shadow.append(rsi, style)

  return el

  function protocol (message, notify) {
    const { from } = message
    state[from] = { value: 0, notify }

    return listen
  }

  function listen (message) {
    const { from, type, body } = message
    state[from].value = body

    if (type == 'update') {
      let notify
      if (from == 'range-0') notify = state['input-integer-0'].notify
      else if (from == 'input-integer-0') notify = state['range-0'].notify
      notify({ type, body })
    }
  }
}

function get_theme () {
  return `
    .rsi {
      padding: 8%;
      display: grid;
      grid-template-columns: 8fr 1fr;
      gap: 10px;
      align-items: center;
    }
  `
}