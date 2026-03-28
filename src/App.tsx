import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Game from './game/game'

function App() {
  return (
    <>
      <section id="header">
      </section>
      <section id="body">
        <Game />
      </section>
      <section id="footer">
      </section>
    </>
  )
}

export default App