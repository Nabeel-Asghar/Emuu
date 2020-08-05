import axios from "axios";

export default axios.create({
  baseURL: `http://localhost:5000/photospot-5f554/us-central1/api`,
});
