import { create } from "apisauce";

// Testing: http://192.168.8.18:8080/api/v1
// Prod: TBD
const api = create({
  baseURL: "http://192.168.8.18:8080/api/v1",
  headers: { "Content-Type": "application/json" },
});

export default api;
