import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePhotoStore } from '../../stores/photoStore';
import { photoService } from '../services/photoService';
import PhotoCard from './PhotoCard';
import { Camera } from 'lucide-react';

const PhotoGrid = () => {
  const { photos, loading, hasMore, fetchPhotos } = usePhotoStore();

  useEffect(() => {
    fetchPhotos(true); // true = reset (opcional, depende de tu implementación)
  }, []);

  const handleDeletePhoto = async () => {
    await fetchPhotos(true); // true = reset
  };

  const orderedPhotos = photos.slice().sort(
    (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
  );

  return (
    <>
      {loading && photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <Camera className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-lg text-gray-500">Cargando fotos...</p>
          </div>
        </div>
      ) : !loading && photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Camera className="h-16 w-16 text-gray-300" />
          <p className="mt-4 text-lg text-gray-700">No se encontraron fotos</p>
          <p className="text-gray-500">¡Sé el primero en compartir una foto!</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={photos.length}
          next={() => fetchPhotos()}
          hasMore={hasMore}
          loader={
            <div className="text-center py-4">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-gray-300 border-t-primary-600 rounded-full" />
              <p className="mt-2 text-gray-600">Cargando más fotos...</p>
            </div>
          }
          endMessage={
            <p className="text-center py-4 text-gray-500">
              ¡Has visto todas las fotos!
            </p>
          }
        >
          <div className="flex flex-col gap-4">
            {orderedPhotos.map(photo => (
              <PhotoCard
                key={photo.idFoto}
                photo={photo}
                onDelete={handleDeletePhoto}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </>
  );
};

export default PhotoGrid;