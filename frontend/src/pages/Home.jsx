import { useContext, useState } from 'react'
import { chatContext } from '../context/ChatContext'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'

const Home = () => {
  const { selectedUser } = useContext(chatContext)
  const [showRightSidebar, setShowRightSidebar] = useState(false)

  return (
    <div className='w-screen h-screen'>
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid relative
        ${selectedUser
          ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
          : 'md:grid-cols-2'
        }`}
      >
        <Sidebar />
        <ChatContainer setShowRightSidebar={setShowRightSidebar} />
        <RightSidebar
          showRightSidebar={showRightSidebar}
          setShowRightSidebar={setShowRightSidebar}
        />
      </div>
    </div>
  )
}

export default Home
