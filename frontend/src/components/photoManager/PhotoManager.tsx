import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import {
  ALLOWED_TYPES,
  MAX_FILE_SIZE,
  MAX_PHOTOS,
  addPhoto,
  getUploadSignature,
  removePhoto,
  uploadToCloudinary,
} from "../../api/photo";
import type { Photo, PhotoResource } from "../../api/photo";
import { optimizedImage } from "../../utils/cloudinary";
import "./PhotoManager.css";

interface PhotoManagerProps {
  resource: PhotoResource;
  resourceId: string;
  initialPhotos: Photo[];
}

interface UploadProgress {
  current: number;
  total: number;
}

function PhotoManager({ resource, resourceId, initialPhotos }: PhotoManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_PHOTOS - photos.length;
  const busy = progress !== null || deletingId !== null;

  function validate(files: File[]): string | null {
    if (files.length > remaining) {
      return `Puoi aggiungere ancora ${remaining} foto (massimo ${MAX_PHOTOS}).`;
    }
    const wrongType = files.find((file) => !ALLOWED_TYPES.includes(file.type));
    if (wrongType) {
      return `"${wrongType.name}" non è supportato. Usa JPG, PNG o WebP.`;
    }
    const tooBig = files.find((file) => file.size > MAX_FILE_SIZE);
    if (tooBig) {
      return `"${tooBig.name}" supera i 5 MB.`;
    }
    return null;
  }

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = ""; // permette di riselezionare lo stesso file
    if (files.length === 0) return;

    const validationError = validate(files);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    try {
      const signature = await getUploadSignature();
      for (let i = 0; i < files.length; i++) {
        setProgress({ current: i + 1, total: files.length });
        const uploaded = await uploadToCloudinary(files[i], signature);
        const updated = await addPhoto(resource, resourceId, uploaded);
        setPhotos(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Caricamento non riuscito");
    } finally {
      setProgress(null);
    }
  }

  async function handleDelete(publicId: string) {
    setDeletingId(publicId);
    setError(null);
    try {
      await removePhoto(resource, resourceId, publicId);
      setPhotos((prev) => prev.filter((photo) => photo.publicId !== publicId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eliminazione non riuscita");
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  }

  return (
    <section className="photo-manager">
      <div className="photo-manager__header">
        <div>
          <h2 className="h5 mb-1">Foto</h2>
          <p className="text-muted small mb-0">
            {photos.length} di {MAX_PHOTOS} · JPG, PNG o WebP fino a 5 MB · la prima foto è la copertina
          </p>
        </div>

        <Button
          type="button"
          variant="outline-primary"
          onClick={() => inputRef.current?.click()}
          disabled={busy || remaining === 0}
        >
          {progress ? (
            <>
              <Spinner size="sm" className="me-2" />
              Caricamento {progress.current} di {progress.total}
            </>
          ) : (
            <>
              <IoCloudUploadOutline className="me-2" />
              Aggiungi foto
            </>
          )}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          multiple
          hidden
          onChange={handleFiles}
        />
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {photos.length === 0 ? (
        <div className="photo-manager__empty">
          Nessuna foto. Le attività con foto ricevono molte più visite.
        </div>
      ) : (
        <div className="photo-manager__grid">
          {photos.map((photo, index) => (
            <figure key={photo.publicId} className="photo-manager__item">
              <img src={optimizedImage(photo.url, 400, 300)} alt={`Foto ${index + 1}`} loading="lazy" />

              {index === 0 && <span className="photo-manager__cover">Copertina</span>}

              {confirmingId === photo.publicId ? (
                <div className="photo-manager__confirm">
                  <span>Eliminare la foto?</span>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(photo.publicId)}
                      disabled={deletingId !== null}
                    >
                      {deletingId === photo.publicId ? <Spinner size="sm" /> : "Elimina"}
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => setConfirmingId(null)}
                      disabled={deletingId !== null}
                    >
                      Annulla
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="photo-manager__delete"
                  aria-label={`Elimina foto ${index + 1}`}
                  onClick={() => setConfirmingId(photo.publicId)}
                  disabled={busy}
                >
                  <IoTrashOutline />
                </button>
              )}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

export default PhotoManager;