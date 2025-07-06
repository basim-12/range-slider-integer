(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const range_slider_integer = require('..')

const opts = { min: 0, max: 10 }
const rsi = range_slider_integer(opts)

document.body.append(rsi)
},{"..":4}],2:[function(require,module,exports){
module.exports = input_integer

const sheet = new CSSStyleSheet()
const theme = get_theme()
sheet.replaceSync(theme)

let id = 0

function input_integer (opts, protocol) {
  const name = `input-integer-${id++}`

  const { min = 1, max = 5 } = opts
  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })

  const input = document.createElement('input')
  input.type = 'number'
  input.min = min
  input.max = max
  if (protocol) {
	notify = protocol({ from: name }, listen)
  }
  function listen (message) {
    const { type, body } = message
    if (type == 'update') input.value = body
  }

  input.onkeyup = (e) => handle_onkeyup(e, input, min, max)
  input.onblur = (e) => handle_on_mouseleave_and_blur(e, input, min)
  input.onmouseleave = (e) => handle_on_mouseleave_and_blur(e, input, min)

  shadow.append(input)
  shadow.adoptedStyleSheets = [sheet]
  return el

  // handlers

  function handle_onkeyup (e, input, min, max) {
    const val = Number(e.target.value)
    const min_len = min.toString().length
    const val_len = val.toString().length
    if (val > max) input.value = max
    else if (min_len === val_len && val < min) input.value = min

    notify({ from: name, type: 'update', body: val })
  }

  function handle_on_mouseleave_and_blur (e, input, min) {
    const val = Number(e.target.value)
    if (val < min) input.value = ''
  }
}

function get_theme () {
  return `
	:host {
	  --b: 0, 0%;
	  --color-white: var(--b), 100%;
	  --color-black: var(--b), 0%;
	  --color-grey: var(--b), 85%;
	  --bg-color: var(--color-grey);
	  --shadow-xy: 0 0;
	  --shadow-blur: 8px;
	  --shadow-color: var(--color-white);
	  --shadow-opacity: 0;
	  --shadow-opacity-focus: 0.65;
	}

	input {
	  text-align: left;
	  align-items: center;
	  font-size: 1.4rem;
	  font-weight: 200;
	  color: hsla(var(--color-black), 1);
	  background-color: hsla(var(--bg-color), 1);
	  padding: 8px 12px;
	  box-shadow: var(--shadow-xy) var(--shadow-blur) hsla( var(--shadow-color), var(--shadow-opacity));
	  transition: font-size .3s, color .3s, background-color .3s, box-shadow .3s ease-in-out;
	  outline: none;
	  border: 1px solid hsla(var(--bg-color), 1);
	  border-radius: 8px;
	}

	input:focus {
	  --shadow-color: var(--color-black);
	  --shadow-opacity: var(--shadow-opacity-focus);
	  --shadow-xy: 4px 4px;
	  box-shadow: var(--shadow-xy) var(--shadow-blur) hsla( var(--shadow-color), var(--shadow-opacity));
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
	  -webkit-appearance: none;
	}
  `
}
},{}],3:[function(require,module,exports){
module.exports = rangeSlider

let id = 0

function rangeSlider (opts, protocol) {
  const name = `range-${id++}`
  const { min = 1, max = 5 } = opts

  const el = document.createElement('div')
  el.classList.add('container')

  const shadow = el.attachShadow({ mode: 'closed' })

  input = document.createElement('input')
  input.type = 'range'
  input.min = min
  input.max = max
  input.value = min

  input.oninput = handle_input

  if (protocol) {
    notify = protocol({ from: name }, listen)
  }
  function listen (message) {
    const { type, body } = message
    if (type == 'update') input.value = body
    fill.style.width = `${(body / max) * 100}%`
    input.focus()
  }

  bar = document.createElement('div')
  bar.classList.add('bar')

  ruler = document.createElement('div')
  ruler.classList.add('ruler')

  fill = document.createElement('div')
  fill.classList.add('fill')

  bar.append(ruler, fill)

  style = document.createElement('style')
  style.textContent = get_theme()

  shadow.append(style, input, bar)
  return el

  // handlers
  function handle_input (e) {
    const val = Number(e.target.value)
    fill.style.width = `${(val / max) * 100}%`
    notify({ from: name, type: 'update', body: val })
  }
}

function get_theme () {
  return `
    :host { box-sizing: border-box; }
    *, *:before, *:after { box-sizing: inherit; }
    :host {
      --white       : hsla(0, 0%, 100%, 1) ;
      --transparent : hsla(0, 0%, 0%, 0);
      --grey        : hsla(0, 0%, 90%, 1);
      --blue        : hsla(207, 88%, 66%, 1);
      position: relative;
      width: 100%;
      height: 16px;
    }
    input {
      position: absolute;
      top: 0;
      left 0; 
      width: 100%;
      -webkit-appearance: none;
      outline: none;
      margin: 0;
      z-index: 2;
      background-color: var(--transparent); 
    }
    .bar {
      position: absolute;
      top: 3px;
      left 0; 
      z-index: 0;
      height: 10px;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      background-color: var(--grey); 
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .ruler {
      position: absolute;
      height: 6px;
      width: 100%;
      transform: scale(-1, 1);
      background-size: 20px 8px;
      background-image: repeating-linear-gradient(to right,
        var(--grey) 0px,
        var(--grey) 17px,
        var(--white) 17px,
        var(--white) 20px
    ); 
    }
    .fill {
      position: absolute;
      height: 100%;
      width: 0%;
      background-color: var(--grey);
    }
    input:focus + .bar .fill,
    input:focus-within + .bar .fill
    input:active + .bar .fill {
      background-color: var(--blue);
    }
    input::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: var(--white);
      border: 1px solid var(--grey);
      cursor: pointer;
      box-shadow: 0 3px 6px rgba(0, 0, 0, .4);
      transition: background-color .3s, box-shadow .15s linear;
    }

    input::-webkit-slider-thumb:hover {
      box-shadow: 0 0 0 14px rgba(94, 176, 245, .8);
    }

    input::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: var(--white);
      border: 1px solid var(--grey);
      cursor: pointer;
      box-shadow: 0 3px 6px rgba(0, 0, 0, .4);
      transition: background-color .3s, box-shadow .15s linear;
    }

    input::-moz-range-thumb:hover {
      box-shadow: 0 0 0 14px rgba(94, 176, 245, .8);
    }

    `
}
},{}],4:[function(require,module,exports){
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
},{"@basim.asim123/input.integer":2,"range-slider-basim":3}]},{},[1]);
