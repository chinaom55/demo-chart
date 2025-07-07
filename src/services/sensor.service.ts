import axios, { type AxiosResponse } from "axios";

const URL = import.meta.env.VITE_API_BFF;

export const getMinute = () => {
  const today = new Date();
  const labels: string[] = [];
  const datas: number[] = [];

  for (let i = 4319; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 60_000); // ย้อน i นาที

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = String(d.getFullYear() + 543);
    const hh = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");

    labels.push(`${dd}/${mm}/${yyyy}-${hh}:${m}`);
    datas.push(parseFloat((Math.random() * 9).toFixed(2)));
  }

  return {
    labels,
    datas,
  };
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
