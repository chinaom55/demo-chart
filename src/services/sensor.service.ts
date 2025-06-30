import axios, { type AxiosResponse } from "axios";

const URL = import.meta.env.VITE_API_BFF;

export const getMinute = (): Promise<AxiosResponse> => {
  return axios({
    method: "get",
    url: `${URL}/api/reports-test/boards/M10AF22ASTSUASF-N05AF22JJVL7QMU/sensor/78/raw/4320`,
  })
    .then((response: AxiosResponse) => {
      return response.data.message;
    })
    .catch((error) => {
      console.error("Error getRoleUsers:", error);
      throw error;
    });
};

export const getHour = (): Promise<AxiosResponse> => {
  return axios({
    method: "get",
    url: `${URL}/api/reports-test/boards/M10AF22ASTSUASF-N05AF22JJVL7QMU/sensor/78/hour/180`,
  })
    .then((response: AxiosResponse) => {
      return response.data.message;
    })
    .catch((error) => {
      console.error("Error getRoleUsers:", error);
      throw error;
    });
};
