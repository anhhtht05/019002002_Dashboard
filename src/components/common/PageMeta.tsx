import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = ({
  meta
}: {
  title?: string;
  description?: string;
  meta?: string;
}) => (
  <Helmet>
    <title>{"Admin Comnosoft"}</title>
    <meta name="description" content={meta} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
