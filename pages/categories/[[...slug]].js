import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout/page';
import { getAllCategorySlugs, getCategoryData} from "../../lib/categories";
import path from 'path';

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function Categories({ categoryData }) {
  return (
    <Layout title={
      categoryData.pathArray.map((item, index) => {
        return (
          <Link key={index} href={'/'+path.join(...categoryData.pathArray.slice(0, index+1))}>{pipe(capitalize)(item)}</Link>
        )
      }).reduce((p, c) => [p, ' > ', c])
    }>
      {
        categoryData.pathArray.map((item, index) => {
          return (
            <Link key={index} href={'/'+path.join(...categoryData.pathArray.slice(0, index+1))}>{pipe(capitalize)(item)}</Link>
          )
        }).reduce((p, c) => [p, ' > ', c])
      }
      <ul>
        {categoryData.children.map((child, index) => {
          return (
            <li key={index}>
              <Link href={child.href}>
                {child.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllCategorySlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const categoryData = getCategoryData(params.slug);
  return {
    props: {
      categoryData
    }
  };
}