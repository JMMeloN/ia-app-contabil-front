import { RemoteGetNotes } from '@/data/usecases/notes/remote-get-notes';
import { HttpClientFactory } from '@/main/factories/http/http-client-factory';
import { API_ENDPOINTS } from '@/main/config/api-config';
import type { GetNotes } from '@/domain/usecases/notes/get-notes';

export const makeGetNotes = (): GetNotes => {
  const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
  return new RemoteGetNotes(API_ENDPOINTS.notes.base, httpClient);
};
