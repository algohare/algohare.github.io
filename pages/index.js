import Layout from '../components/layout/page';
import Head from 'next/head';
import Link from 'next/link';

import { getSortedPostsData } from '../lib/posts';

export default function Home({ allPostsData }) {
  return (
    <Layout>
      <Head>
      </Head>

      <h1>Hello World!</h1>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id}>
            <Link href={`/posts/${id}`}>
              {title}
            </Link>
            <br />
            {date}
            <br />
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    }
  };
}