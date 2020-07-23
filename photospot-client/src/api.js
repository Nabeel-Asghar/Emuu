import axios from "axios";

export default axios.create({
  baseURL: `https://us-central1-photospot-5f554.cloudfunctions.net/api/`,
});
