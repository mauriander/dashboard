import { fetchJson } from "../../../core/http/fetchJson";
import { API_ENDPOINTS } from "../../../config/api";

export async function searchLocationsByName(name) {
  return fetchJson(API_ENDPOINTS.geocodingSearch({ name }));
}
