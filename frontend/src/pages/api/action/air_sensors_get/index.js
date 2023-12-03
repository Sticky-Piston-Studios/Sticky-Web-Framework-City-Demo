import { API_URL } from "src/constants";
import { callEndpoint, findEndpointConfig, config } from "src/utils.js";

export default async function handler(req, res) {
  try {
    const endpointPath = `/api/action/air_sensors_get/`;

    const apikey = req.query?.apikey;

    const endpointConfig = findEndpointConfig(
      endpointPath,
      req.method,
      undefined
    );

    if (!endpointConfig) {
      res.status(404).json({ error: "Endpoint not found" });
      return;
    }

    const url = `${API_URL}${endpointPath}${apikey ? `?apikey=${apikey}` : ""}`;

    console.log("url is: ", url);

    const endpointBody = config.EndpointBodies.find(
      (e) => e.Name === endpointConfig.Name
    );

    const result = await callEndpoint(url, req, endpointBody);

    res.status(result.status).json(result.body);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Error forwarding the request" });
  }
}
