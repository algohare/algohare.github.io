import Head from 'next/head';

import { getSortedPostsData } from '../lib/posts';

export default function Home({ allPostsData }) {
  return (
    <>
      <Head>
      </Head>

      <h1>Hello World!</h1>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id}>
            {title}
            <br />
            {date}
            <br />
          </li>
        ))}
      </ul>
    </>
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