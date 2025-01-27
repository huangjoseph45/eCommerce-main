function getCountryCode(countryName) {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    for (let code of Object.keys(regionNames.resolvedOptions().region)) {
      if (regionNames.of(code).toLowerCase() === countryName.toLowerCase()) {
        return code;
      }
    }
    throw new Error(`Country code for "${countryName}" not found.`);
  } catch (error) {
    console.error(error.message);
  }
}

export default getCountryCode;
