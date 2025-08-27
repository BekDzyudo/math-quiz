import { Link } from 'react-router-dom'
import { GrFormNextLink } from 'react-icons/gr'

function OptionQuiz() {
    const userData = JSON.parse(localStorage.getItem("user-data"));
    
  return (
     <div className="w-full h-screen flex justify-center items-center">
      <div className=' flex flex-col gap-10 md:gap-10'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-center text-2xl md:text-3xl text-[#abc1e1]'>Xush kelibsiz, {userData ? userData.first_name + " " + userData.last_name : ""}</h1>
            <p className='text-center text-white text-xl'>Test turini tanlang</p>
        </div>
      <div className='flex md:flex-row flex-col md:gap-10 gap-5'>
        <div
        className="md:w-md lg:w-lg w-80 shadow-2xl h-min rounded-2xl flex flex-col gap-3 md:gap-4 p-5 transform transition duration-300 scale-100 hover:scale-105"
      >
        <h1 className="md:text-3xl text-xl font-semibold text-center mb-4 text-[#abc1e1]">Milliy sertifikat</h1>
        <p className='text-[#abc1e1] text-center'>Milliy sertifikat olish uchun testlar</p>
          <Link
            className="btn btn-info text-white text-lg py-2 rounded-[6px]"
          >
            Testlarni ko‘rish
          </Link>
      </div>
       <div
        className=" md:w-md lg:w-lg w-80 shadow-2xl h-min rounded-2xl flex flex-col gap-3 md:gap-4 p-5 transform transition duration-300 scale-100 hover:scale-105"
      >
        <h1 className="md:text-3xl text-xl font-semibold text-center mb-4 text-[#abc1e1]">Attestatsiya</h1>
        <p className='text-[#abc1e1] text-center'>Attestatsiya testlari</p>
         <Link
          to="/attestatsiya-testlari"
            className="btn btn-info text-white text-lg py-2 rounded-[6px]"
          >
            Testlarni ko‘rish
          </Link>
      </div>
      </div>
      </div>
    </div>
  )
}

export default OptionQuiz