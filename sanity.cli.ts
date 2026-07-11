import { defineCliConfig } from "sanity/cli";
import { getSanityDataset, getSanityProjectId } from "./src/sanity/env";

export default defineCliConfig({
  api: {
    projectId: getSanityProjectId(),
    dataset: getSanityDataset(),
  },
  studioHost: "sunnah-remedies",
  deployment: {
    appId: "lbp9vdqznmr79oory9nqibek",
  },
});
