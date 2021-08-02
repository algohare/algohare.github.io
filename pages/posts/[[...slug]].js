import Head from 'next/head';
import Layout from '../../components/layout/post';
import { getAllPostSlugs, getPostData } from "../../lib/posts";

export default function Posts({ postData }) {
  return (
    <Layout title={postData.title} categoryData={postData.categoryData}>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <h1>{postData.title}</h1>
      <div>
        <h2>{postData.date}</h2>
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData
    }
  };
}