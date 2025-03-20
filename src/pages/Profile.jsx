import React, { useState } from 'react';
import MainLayout from "../layouts/MainLayout";
import { FaUpload, FaSave, FaKey } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../style/Profile.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    nombre: 'Florian Lizet Mata',
    primerApellido: '',
    segundoApellido: '',
    correoPersonal: 'florian@example.com',
    correoEmpresa: 'florian@empresa.com',
    telefonoPersonal: '555-1234',
    telefonoEmpresa: '555-5678',
    direccion: 'Calle Falsa 123',
    rol: 'Soporte',
    horario: 'Completo',
    usuario: 'florianMata',
    contrasena: '',
    fotografia: 'https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png',
    estado: 'Activo',
    homeOffice: 'Lunes',
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

  const handleSave = () => {
    console.log('Datos guardados:', formData);
    Swal.fire('Éxito', 'Cambios guardados correctamente.', 'success');
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Cambiar Contraseña',
      html:
        '<input id="swal-input1" type="password" class="swal2-input" placeholder="Nueva contraseña">' +
        '<input id="swal-input2" type="password" class="swal2-input" placeholder="Confirmar contraseña">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const newPassword = document.getElementById('swal-input1').value;
        const confirmPassword = document.getElementById('swal-input2').value;
        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage('Ambos campos son obligatorios');
          return false;
        }
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Las contraseñas no coinciden');
          return false;
        }
        return { newPassword };
      }
    });

    if (formValues) {
      setFormData({
        ...formData,
        contrasena: formValues.newPassword,
      });
      Swal.fire('¡Éxito!', 'Tu contraseña ha sido cambiada.', 'success');
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        <div className="card-contenedor">
          <h1 className="dashboard-title">Perfil de Usuario</h1>
          <div className="profile-content">
            {/* Sección de la imagen */}
            <div className="profile-image-container">
              <div className="profile-image">
                <img
                  src={formData.fotografia}
                  alt="Foto de perfil"
                  className="profile-img"
                />
                <label htmlFor="upload-photo" className="upload-icon">
                  <FaUpload />
                  <input
                    type="file"
                    id="upload-photo"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <p className="image-text">Cambiar foto</p>
            </div>

            {/* Sección de la información */}
            <div className="profile-info">
              <form className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Primer Apellido</label>
                    <input
                      type="text"
                      name="primerApellido"
                      value={formData.primerApellido}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Segundo Apellido</label>
                    <input
                      type="text"
                      name="segundoApellido"
                      value={formData.segundoApellido}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Usuario</label>
                    <input
                      type="text"
                      name="usuario"
                      value={formData.usuario}
                      disabled
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Correo Personal</label>
                    <input
                      type="email"
                      name="correoPersonal"
                      value={formData.correoPersonal}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Correo Empresa</label>
                    <input
                      type="email"
                      name="correoEmpresa"
                      value={formData.correoEmpresa}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Teléfono Personal</label>
                    <input
                      type="tel"
                      name="telefonoPersonal"
                      value={formData.telefonoPersonal}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono Empresa</label>
                    <input
                      type="tel"
                      name="telefonoEmpresa"
                      value={formData.telefonoEmpresa}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Rol</label>
                    <input
                      type="text"
                      value={formData.rol}
                      disabled
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Horario</label>
                    <input
                      type="text"
                      value={formData.horario}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Home Office</label>
                    <input
                      type="text"
                      value={formData.homeOffice}
                      disabled
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Estado</label>
                    <input
                      type="text"
                      value={formData.estado}
                      disabled
                    />
                  </div>
                </div>

                <div className="form-actions" style={{ gap: '10px' }}>
                  <button type="button" className="btn-save" onClick={handleSave}>
                    <FaSave /> Guardar Cambios
                  </button>
                                    <button
                    type="button"
                    className="btn-save"
                    style={{ backgroundColor: '#E67E22', marginLeft: '10px' }}
                    onClick={handleChangePassword}
                  >
                    <FaKey /> Cambiar Contraseña
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
