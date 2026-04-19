type Feature = "Water" | "Forest" | "Mountain" | "City";

export type { Feature };


const features: Record<string, string> = {
  Water: "#90e0ef",
  Forest: "#6a994e",
  Mountain: "#adb5bd",
  City: "#e9ecef",
};

export default features;
