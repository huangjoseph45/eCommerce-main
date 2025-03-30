import { useState } from "react";

const useFetchSections = () => {
  const [isFetchingSectionsLoading, setFetchingSectionsLoading] =
    useState(false);
  const [sectionResults, setSectionResults] = useState(null);

  const fetchSections = async () => {
    const path = `${import.meta.env.VITE_PATH}/content/fetch-section`;
    try {
      setFetchingSectionsLoading(true);

      const response = await fetch(path, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        setFetchingSectionsLoading(false);
        console.error("Fetching sections is not ok");
        return;
      }
      const fetchedSections = await response.json();
      setSectionResults(fetchedSections.returnSections);
      setFetchingSectionsLoading(false);
    } catch (error) {
      console.error(error);
      setFetchingSectionsLoading(false);
    }
  };

  const tryFetchSections = () => {
    fetchSections();
  };

  return [
    isFetchingSectionsLoading,
    sectionResults,
    setSectionResults,
    tryFetchSections,
  ];
};

const useCreateSections = () => {
  const [isCreateSectionsLoading, setCreateSectionsLoading] = useState(false);

  const createSection = async (sectionData) => {
    const path = `${import.meta.env.VITE_PATH}/content/create-section`;

    try {
      setCreateSectionsLoading(true);
      const response = await fetch(path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawData: JSON.stringify(sectionData),
        }),
      });
      if (!response.ok) {
        setCreateSectionsLoading(false);
        console.error("Fetching sections is not ok");
        return;
      }

      setCreateSectionsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const tryCreateSection = (data) => {
    createSection(data);
  };

  return [isCreateSectionsLoading, tryCreateSection];
};

export { useFetchSections, useCreateSections };
