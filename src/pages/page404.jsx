import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Page404.css';

const Page404 = () => {
  const navigate = useNavigate();
  
  const handleReturn = () => {
    const isLoggedIn = localStorage.getItem('token');
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  return (
    <main className="main-ed flex flex-col items-center justify-center h-screen text-center bg-gray-800 font-montserrat">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg">
        <h1 className="h1-ed text-9xl md:text-[12.5rem] text-gray-200 tracking-wider drop-shadow-lg whitespace-nowrap">
          4<span className="span-ed inline-block animate-bounce">
            <img src="/vi.png" alt="Error Icon" className="w-24 inline" />
          </span>4
        </h1>
        <h2 className="h2-ed text-2xl text-gray-200 mb-4">Error: 404 pagina  no encontrada</h2>
        <p className="p-ed text-gray-400 mb-6">Perdon, No se puede acceder a la página que estás buscando</p>
        <button onClick={handleReturn} className="button-ed bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Regresar
        </button>
      </div>
    </main>
  );
}

export default Page404;
