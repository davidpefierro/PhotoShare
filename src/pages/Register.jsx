import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { Camera, User, Mail, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Swal from 'sweetalert2';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const contrasena = watch('contrasena', '');

  const onSubmit = async (data) => {
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      const firstErrorMessage = errors[firstErrorKey]?.message;
      if (firstErrorMessage) {
        Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          text: firstErrorMessage,
        });
        return;
      }
    }

    setIsLoading(true);

    const { confirmPassword, ...registerData } = data;

    try {
      const response = await authService.register(registerData);

      if (response.success && response.data) {
        login(response.data);
        navigate('/');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrarse',
          text: response.message || 'Por favor, inténtalo de nuevo.',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ha ocurrido un error. Por favor, inténtalo más tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Camera className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          Crea una nueva cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          O{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            inicia sesión en tu cuenta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  id="nombre"
                  label="Nombre"
                  type="text"
                  autoComplete="given-name"
                  error={errors.nombre?.message}
                  fullWidth
                  {...register('nombre', {
                    required: 'El nombre es obligatorio',
                  })}
                />
              </div>

              <div>
                <Input
                  id="apellidos"
                  label="Apellidos"
                  type="text"
                  autoComplete="family-name"
                  error={errors.apellidos?.message}
                  fullWidth
                  {...register('apellidos', {
                    required: 'Los apellidos son obligatorios',
                  })}
                />
              </div>
            </div>

            <div>
              <Input
                id="nombreUsuario"
                label="Nombre de usuario"
                type="text"
                autoComplete="username"
                leftIcon={<User className="h-5 w-5" />}
                error={errors.nombreUsuario?.message}
                fullWidth
                {...register('nombreUsuario', {
                  required: 'El nombre de usuario es obligatorio',
                  minLength: {
                    value: 3,
                    message: 'Debe tener al menos 3 caracteres',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+$/,
                    message:
                      'Solo se permiten letras, números, puntos, guiones y guiones bajos',
                  },
                })}
              />
            </div>

            <div>
              <Input
                id="correo"
                label="Correo electrónico"
                type="email"
                autoComplete="email"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.correo?.message}
                fullWidth
                {...register('correo', {
                  required: 'El correo electrónico es obligatorio',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido',
                  },
                })}
              />
            </div>

            <div>
              <Input
                id="contrasena"
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.contrasena?.message}
                fullWidth
                {...register('contrasena', {
                  required: 'La contraseña es obligatoria',
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
                    message:
                      'Debe tener al menos 6 caracteres, una mayúscula, un número y un símbolo',
                  },
                })}
              />
            </div>

            <div>
              <Input
                id="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                autoComplete="new-password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.confirmPassword?.message}
                fullWidth
                {...register('confirmPassword', {
                  required: 'Por favor, confirma tu contraseña',
                  validate: (value) =>
                    value === contrasena || 'Las contraseñas no coinciden',
                })}
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
              >
                Crear cuenta
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;