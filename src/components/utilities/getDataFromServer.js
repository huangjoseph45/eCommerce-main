// getDataFromServer.js
import _ from "lodash";
import { useContext, useEffect, useState, useCallback } from "react";
import { ProductContext } from "./ContextManager";
import { isEqual } from "lodash";

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

const useFetchServerData = ({ queries, auth }) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);

  const getDataFunc = async () => {
    if (!auth) {
      throw new Error(`User is not authorized`);
    }
    try {
      setLoading(false);

      const response = await fetch(
        "http://localhost:2000/api/users/fetch-data",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queries) || null,
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const new_data = await response.json();
      setData(new_data);
    } catch (error) {
      setIsError(true);
      console.error("Failed to fetch data from server:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (Array.isArray(queries)) {
      getDataFunc();
    } else {
      console.log("Not an array");
    }
    setLoading(false);
  }, []);

  const refetch = useCallback(() => {
    setLoading(true);
    getDataFunc();
  }, [data]);
  return { isLoading, data, setData, isError, refetch };
};

export default useFetchServerData;
