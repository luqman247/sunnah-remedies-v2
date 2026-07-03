import { getNavigation } from "@/sanity/lib/fetch";
import { Masthead } from "./Masthead";

export async function MastheadServer() {
  const nav = await getNavigation();
  return <Masthead navItems={nav.items} />;
}
