import React from 'react'
import Mainroutes from './Routes/Mainroutes'
import assets from './assets/assets'
import InstallPWA from './InstallPwa'

const App = () => {
  return (
    <div>
      <InstallPWA />
      <div style={{ backgroundImage: `url(${assets.bgImage})` }} className="bg-contain bg-center bg-cover">
        <Mainroutes />
      </div>
    </div>
  )
}

export default App
