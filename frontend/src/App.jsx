import React from 'react'
import Mainroutes from './Routes/Mainroutes'
import assets from './assets/assets'

const App = () => {
  return (
    <div
      style={{ backgroundImage: `url(${assets.bgImage})` }}
      className="bg-contain bg-center bg-cover"
    >
      <Mainroutes />
    </div>
  )
}

export default App
