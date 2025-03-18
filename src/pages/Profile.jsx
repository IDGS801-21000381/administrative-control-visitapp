import React, { useState } from 'react';
import MainLayout from "../layouts/MainLayout";
import '../style/Profile.css'; // Asegúrate de que el archivo CSS esté correctamente vinculado

const Profile = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    correoPersonal: '',
    correoEmpresa: '',
    telefonoPersonal: '',
    telefonoEmpresa: '',
    direccion: '',
    rol: 'administrador',
    horario: '',
    usuario: '',
    contrasena: '',
    fotografia: '',
    estado: 'activo',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          fotografia: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <MainLayout>
        <h1>Perfil del usuario</h1>
        <div className="profile-content">
          <div className="profile-image">
            <img
              src={formData.fotografia || "https://via.placeholder.com/150"}
              alt="Foto de perfil"
            />
            <input type="file" onChange={handleImageChange} />
          </div>
          <div className="profile-form">
            <form>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </label>
              <label>
                Primer Apellido:
                <input
                  type="text"
                  name="primerApellido"
                  value={formData.primerApellido}
                  onChange={handleChange}
                />
              </label>
              <label>
                Segundo Apellido:
                <input
                  type="text"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleChange}
                />
              </label>
              <label>
                Correo Personal:
                <input
                  type="email"
                  name="correoPersonal"
                  value={formData.correoPersonal}
                  onChange={handleChange}
                />
              </label>
              <label>
                Correo Empresa:
                <input
                  type="email"
                  name="correoEmpresa"
                  value={formData.correoEmpresa}
                  onChange={handleChange}
                />
              </label>
              <label>
                Teléfono Personal:
                <input
                  type="tel"
                  name="telefonoPersonal"
                  value={formData.telefonoPersonal}
                  onChange={handleChange}
                />
              </label>
              <label>
                Teléfono Empresa:
                <input
                  type="tel"
                  name="telefonoEmpresa"
                  value={formData.telefonoEmpresa}
                  onChange={handleChange}
                />
              </label>
              <label>
                Dirección:
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </label>
              <label>
                Rol:
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="administrador">Administrador</option>
                  <option value="empleado">Empleado</option>
                </select>
              </label>
              <label>
                Horario:
                <input
                  type="text"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                />
              </label>
              <label>
                Usuario:
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                />
              </label>
              <label>
                Contraseña:
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                />
              </label>
              <label>
                Estado:
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </label>
            </form>
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default Profile;