import React from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
function Home() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      {/* Phần body */}
      <div className="flex-grow bg-gray-200 p-6">
        {/* Nội dung trang home */}
      </div>
    </div>
  )
}

export default Home