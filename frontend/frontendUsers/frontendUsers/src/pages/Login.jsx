import React from "react";

const Login = () => {
  return (
    <div className="relative min-h-screen w-full flex overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Sección del formulario - Más a la izquierda y más ancha */}
      <div className="w-full md:w-[55%] flex flex-col justify-center pl-12 pr-8 md:pl-16 md:pr-12 bg-white">
        <div className="max-w-lg w-full">
          
          {/* Título más grande y más a la izquierda */}
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-gray-900 text-left">
            Iniciar sesión
          </h1>

          {/* Formulario con elementos más largos */}
          <div className="space-y-8">
            
            {/* Campo Email más ancho */}
            <div className="text-left">
              <label className="block text-base md:text-lg font-medium text-gray-700 mb-3">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C0A05] focus:border-transparent"
                placeholder="usuario@ejemplo.com"
                style={{ minWidth: '100%' }}
              />
            </div>

            {/* Campo Contraseña más ancho */}
            <div className="text-left">
              <label className="block text-base md:text-lg font-medium text-gray-700 mb-3">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl pr-14 focus:outline-none focus:ring-2 focus:ring-[#5C0A05] focus:border-transparent"
                  placeholder="••••••••"
                  style={{ minWidth: '100%' }}
                />
                <button className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Botón Ingresar más grande */}
            <button className="w-full bg-[#5C0A05] hover:bg-[#400904] text-white py-4 rounded-xl font-semibold text-lg md:text-xl transition-colors shadow-lg mt-10">
              Ingresar
            </button>

            {/* Divisor centrado */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500 text-lg">o</span>
              </div>
            </div>

            {/* Botón Google más grande */}
            <button className="w-full flex items-center justify-center gap-4 border-2 border-gray-200 py-4 rounded-xl hover:bg-gray-50 transition-colors">
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google" 
                className="h-6 w-6"
              />
              <span className="text-base md:text-lg font-medium text-gray-700">
                Continuar con Google
              </span>
            </button>

            {/* Texto para crear cuenta */}
<div className="mt-10 text-center text-gray-600 text-base md:text-lg">
  ¿No tienes una cuenta?{" "}
  <a href="/registro" className="text-[#5C0A05] font-semibold hover:underline">
    Crea una
  </a>
</div>
          </div>
        </div>
      </div>

      {/* Sección del banner rojo con bordes redondeados */}
      <div className="hidden md:block fixed right-0 top-0 bottom-0 w-[45%] bg-[#5C0A05] rounded-tl-3xl rounded-bl-3xl">
        <div className="h-full flex items-center justify-center p-16">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-8"></h2>
            <p className="text-2xl opacity-90 leading-relaxed">
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;