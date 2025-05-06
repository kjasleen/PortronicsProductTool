import React from 'react'
import OngoingProducts from '../Components/Ongoing'
import CompletedProducts from '../Components/Completed'

function Dashboard() {
  //const router = useRouter(); // for navigation

  const handleNavigate = () => {
    //router.push("/new-product"); // change to your target route
  };
  return (
    <div className="p-2">
      {/* Title - Centered */}
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight text-center mb-4">
        Products
      </h1>

      {/* Button container - Right-aligned button */}
      <div className="flex justify-end mb-4">
      <button
        onClick={handleNavigate}
        className="bg-blue-600 text-black !text-2xl px-8 py-4 rounded-lg shadow hover:bg-blue-700 transition"
      >
          + Add Product
        </button>
      </div>


      <OngoingProducts/>
      <CompletedProducts/>
    </div>
  )
}

export default Dashboard