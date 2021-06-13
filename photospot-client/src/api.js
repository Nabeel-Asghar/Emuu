import axios from "axios";

// Prod
//const baseUrl = "http://localhost:5000/photospot-5f554/us-central1/api";
//const baseUrl = "https://us-central1-photospot-5f554.cloudfunctions.net/api";

// Dev
const baseUrl = "http://localhost:5000/photospot-dev-b174a/us-central1/api";

export default axios.create({
  baseURL: baseUrl,
});
