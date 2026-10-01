import { makeRequest } from '@/api/base';
import type { Person } from '@/types/person';

const baseURL = 'http://localhost:8080/persons';

export async function getAllPersons(): Promise<Person[]> {
  return makeRequest<Person[]>(baseURL, 'GET');
}
