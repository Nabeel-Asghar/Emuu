import axios from "axios";

const baseUrl = "http://localhost:5000/photospot-5f554/us-central1/api";
//const baseUrl = "https://us-central1-photospot-5f554.cloudfunctions.net/api";

export default axios.create({
  baseURL: baseUrl,
});
