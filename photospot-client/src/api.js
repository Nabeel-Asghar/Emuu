import axios from "axios";

export default axios.create({
  baseURL: `http://localhost:5001/photospot-5f554/us-central1/api`,
});
