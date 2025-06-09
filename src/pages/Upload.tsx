import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { photoService } from '../services/photoService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore(); // <-- AÑADIDO user

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('El tamaño del archivo debe ser menor a 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecciona un archivo de imagen');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona una foto para subir');
      return;
    }

    if (!description.trim()) {
      setError('Por favor, añade una descripción');
      return;
    }
console.log(user)
    if (!user || !user.id) {
      setError('No hay usuario autenticado');
      return;
    }
    setIsUploading(true);
    setError(null);

    try {
      const response = await photoService.subirFoto({
        imageFile: selectedFile,
        description: description.trim(),
        idUsuario: user.id // <-- PASA el id de usuario autenticado
      });
      console.log(response)
      if (response.success && response.data) {
        navigate(`/fotografias/${response.data.id}`);
      } else {
        setError(response.message || 'Error al subir la foto');
      }
    } catch (err) {
      alert(err)
      setError('Ha ocurrido un error inesperado');
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Subir una Foto</h1>

          {error && (
            <div className="mb-4 p-4 rounded-md bg-red-50 text-red-800">
              {error}
            </div>
          )}

          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Haz clic para subir una foto
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  PNG, JPG, GIF hasta 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={preview!}
                  alt="Vista previa"
                  className="w-full h-96 object-cover rounded-lg"
                />
                <button
                  onClick={clearSelection}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="mt-4">
                <Input
                  label="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escribe algo sobre tu foto..."
                  maxLength={500}
                  fullWidth
                />
                <p className="mt-2 text-sm text-gray-500">
                  {description.length}/500 caracteres
                </p>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpload}
                  isLoading={isUploading}
                  leftIcon={<Upload className="h-5 w-5" />}
                >
                  Subir Foto
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;