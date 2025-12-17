import { RemoteCreateNote } from '@/data/usecases/notes/remote-create-note';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_ENDPOINTS } from '@/main/config/api-config';
import type { CreateNote } from '@/domain/usecases/notes/create-note';

export const makeCreateNote = (): CreateNote => {
  const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
  return new RemoteCreateNote(API_ENDPOINTS.notes.base, httpClient);
};
