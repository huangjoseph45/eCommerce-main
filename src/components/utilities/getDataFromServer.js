// getDataFromServer.js
import _ from "lodash";
import { useState } from "react";

const getDataFromServer = async ({ setUserInfo = null, userInfo }) => {
  try {
    const dataResponse = await fetch(
      "http://localhost:2000/api/users/set-data",
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!dataResponse.ok) {
      throw new Error(
        `Network response was not ok: ${dataResponse.statusText}`
      );
    }

    const json = await dataResponse.json();
    if (!_.isEqual(json, userInfo)) setUserInfo(json);
    console.log(json);
    return json;
  } catch (error) {
    console.error("Failed to fetch data from server:", error);
    throw error; // Re-throw the error to allow the caller to handle it
  }
};

export default getDataFromServer;

const useFetchServerData = () => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState();
};
