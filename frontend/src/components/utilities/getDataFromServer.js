// getDataFromServer.js
import _ from "lodash";
import { useContext, useEffect, useState, useCallback } from "react";
import useLogout from "./useLogout";

// const getDataFromServer = async ({ setUserInfo = null, userInfo }) => {
//   try {
//     const dataResponse = await fetch(
//       "http://localhost:2000/api/users/fetch-data",
//       {
//         method: "GET",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     if (!dataResponse.ok) {
//       throw new Error(
//         `Network response was not ok: ${dataResponse.statusText}`
//       );
//     }

//     const json = await dataResponse.json();
//     if (!_.isEqual(json, userInfo)) setUserInfo(json);
//     console.log(json);
//     return json;
//   } catch (error) {
//     console.error("Failed to fetch data from server:", error);
//     throw error; // Re-throw the error to allow the caller to handle it
//   }
// };

const useFetchServerData = (options = {}) => {
  const { queries = null, auth = null } = options;
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, result, tryLogout] = useLogout();

  const getDataFunc = async (queries, auth) => {
    if (!auth) {
      throw new Error(`User is not authorized`);
    }
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PATH}/users/fetch-data`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queries) || null,
        }
      );
      const res = await response.json();
      if (!response.ok && res.status !== 401) {
        setLoading(false);
        console.log(response);
        console.log(res);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      setData(res);
    } catch (error) {
      setIsError(true);
      console.error("Failed to fetch data from server:", error);
      throw error;
    }
    setLoading(false);
  };

  const refetch = ({ queries, auth }) => {
    getDataFunc(queries, auth);
  };

  return { isLoading, data, setData, isError, refetch };
};

export default useFetchServerData;
