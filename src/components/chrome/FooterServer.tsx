import { getFooter } from "@/sanity/lib/fetch";
import { PreFooter, Footer } from "./Footer";

export async function FooterServer() {
  const footer = await getFooter();
  return (
    <>
      <PreFooter
        action={footer.preFooterAction}
      />
      <Footer
        columns={footer.columns}
        closingStatement={footer.closingStatement}
        colophon={footer.colophon}
      />
    </>
  );
}
