// import { gameTimer } from './game-timer'

const flags = {}

function send(evt) {
  if (flags[evt] || GM.status.state !== 'levelProgress') {
    return
  }

  flags[evt] = true
  GM.trigger.custom(evt)
}

export const customEvents = {
  userFailedTimer: (time) => {
    // const time = gameTimer.getElapsedTimeInSeconds()
    console.log('custom event', `UserFailed${time}sec`);
    send(`UserFailed${time}sec`)
  },

  foundEnemy: (counter) => {
    console.log('custom event', `Found${counter}`);
    send(`Found${counter}`)
  }
}
