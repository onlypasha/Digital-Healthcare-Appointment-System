import React from 'react';
import { useNavigate } from 'react-router-dom';
import Vector2 from './assets/Vector 2.svg'; 

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#769471] to-[#6b8567] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#89a484] rounded-[40px] overflow-visible shadow-2xl relative">
        <div className="flex flex-col md:flex-roin-h-[550px] relative">
          
          {/* vector 2*/}
          <div className="absolute top-0 left-0 bottom-0 w-full md:w-3/5 overflow-hidden pointer-events-none z-0">
            <img 
              src={Vector2} 
              className="w-full h-full object-cover" 
              alt="Background decoration" 
            />
          </div>

          {/* form */}
          <div className="w-full md:w-1/2 md:ml-auto flex flex-col justify-center px-8 md:px-12 py-12 text-white relative z-10">
            <h1 className="text-4xl font-light mb-12 tracking-[0.15em] text-center uppercase">
              Login
            </h1>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-xs tracking-[0.2em] uppercase block mb-2 opacity-80">
                  Username
                </label>
                <input 
                  type="text" 
                  className="w-full bg-[#6b8567] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#b2c4ad] transition placeholder-gray-300"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] uppercase block mb-2 opacity-80">
                  Password
                </label>
                <input 
                  type="password" 
                  className="w-full bg-[#6b8567] text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#b2c4ad] transition placeholder-gray-300"
                  placeholder="Enter your password"
                />
                <a href="#" className="text-xs underline opacity-60 hover:opacity-100 transition block mt-2 text-right">
                  Forgot Password ?
                </a>
              </div>

              <button 
                type="submit" 
                className="w-full mt-8 bg-[#b2c4ad] text-[#4a6345] font-bold py-3.5 rounded-2xl tracking-[0.1em] uppercase shadow-lg hover:bg-[#a1b59a] transition-all duration-200"
              >
                Login
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs opacity-70 tracking-[0.1em] uppercase">
                Don't Have An Account ?
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="text-sm font-bold underline tracking-[0.05em] mt-2 inline-block hover:text-[#b2c4ad] transition bg-none border-none cursor-pointer p-0"
              >
                Register
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;