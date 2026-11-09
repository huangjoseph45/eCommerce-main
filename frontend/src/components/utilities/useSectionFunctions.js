import { useState } from "react";
import {
  demoSections,
  markDemoCatalog,
  clearDemoCatalog,
} from "../../data/demoCatalog";

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
        // Live backend unreachable: serve the demo catalog instead of
        // leaving the home page on loading placeholders forever.
        setSectionResults(demoSections);
        markDemoCatalog();
        setFetchingSectionsLoading(false);
        return;
      }
      // A down backend (or a dev server's SPA fallback) answers non-JSON
      // pages with a 200, so only parse the body when it is actually JSON.
      if (!response.headers.get("content-type")?.includes("application/json")) {
        setSectionResults(demoSections);
        markDemoCatalog();
        setFetchingSectionsLoading(false);
        return;
      }
      const fetchedSections = await response.json();

      clearDemoCatalog();
      setSectionResults(fetchedSections.returnSections);
      setFetchingSectionsLoading(false);
    } catch (error) {
      console.warn("Live backend unreachable, serving demo catalog:", error);
      setSectionResults(demoSections);
      markDemoCatalog();
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
      console.error(error);
    }
  };

  const tryCreateSection = (data) => {
    createSection(data);
  };

  return [isCreateSectionsLoading, tryCreateSection];
};

export { useFetchSections, useCreateSections };
