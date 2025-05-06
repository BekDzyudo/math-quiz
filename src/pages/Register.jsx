import React from 'react'

function Register() {
    
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <form className='shadow-2xl h-min rounded-2xl flex flex-col gap-4 p-5'>
        <h1 className='text-5xl font-semibold text-center mb-4'>Register</h1>
            <div className='flex flex-col gap-0.5'>
                <label htmlFor="firstname">Ism:</label>
                <input className='w-96 border border-gray-600 rounded-md h-12 outline-0 px-2' type="text" id='firstname'/>
            </div>
            <div className='flex flex-col gap-0.5'>
                <label htmlFor="lastname">Familya:</label>
                <input className='w-96 border border-gray-600 rounded-md h-12 outline-0 px-2' type="text" id='lastname'/>
            </div>
            <div className='flex flex-col gap-0.5'>
                <label htmlFor="phonenumber">Telefon nomer:</label>
                <input className='w-96 border border-gray-600 rounded-md h-12 outline-0 px-2' type="text" id='phonenumber'/>
            </div>
            <div className='flex flex-col gap-0.5'>
                <label htmlFor="toifaselect">Toifani tanlang:</label>
                <select className='w-96 border border-gray-600 rounded-md h-12 outline-0 px-2' id="toifaselect">
                    <option value="">1-Toifa</option>
                    <option value="">2-Toifa</option>
                    <option value="">Oliy toifa</option>
                </select>
            </div>
            <div className='flex flex-col gap-0.5'>
                <button type='submit' className='btnCreate' >Testni boshlash</button>
            </div>
        </form>
    </div>
  )
}

export default Register