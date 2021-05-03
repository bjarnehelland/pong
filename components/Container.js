import Head from "next/head";
import { useRouter } from "next/router";

const baseUrl = "https://pong.bjarnehelland.com";

export function Container(props) {
  const { children, ...customMeta } = props;
  const router = useRouter();

  const meta = {
    title: "Pong",
    description: `Ping pong score board.`,
    image: `${baseUrl}/images/banner.png`,
    type: "website",
    ...customMeta,
  };

  return (
    <div className="h-screen grid items-center">
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta content={meta.description} name="description" />
        <meta property="og:url" content={`${baseUrl}${router.asPath}`} />
        <link rel="canonical" href={`${baseUrl}${router.asPath}`} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content="Pong" />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@bjarnehelland" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
      </Head>

      {children}
    </div>
  );
}
