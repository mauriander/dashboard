import { fetchJson } from "../../../core/http/fetchJson";
import { API_ENDPOINTS } from "../../../config/api";

export async function fetchTransportByRoute(routeId) {
  return fetchJson(API_ENDPOINTS.transportVehiclePositions({ routeId }));
}

export async function fetchAllTransportVehicles() {
  return fetchJson(API_ENDPOINTS.transportAllVehiclePositions);
}
