import Head from 'next/head';
import { getAllPostIds, getPostData } from "../../lib/posts";
import utilStyles from '../../styles/utils.module.scss';

import TableOfContents from '../../components/tableOfContents';
import Header from '../../components/header';
import TerminalBar from '../../components/terminalBar';

export default function Posts({ postData }) {
  return (
    <>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <header className={utilStyles.headerContainer}>
        <Header/>
      </header>
      <main className={utilStyles.mainContainer}>
        {/* <MainHeader className={`${utilStyles.mainheaderContainer} ${utilStyles.mainheaderContainer__gridArea}`}/> */}
        <div className={utilStyles.maincontentContainer}>
          <div className={utilStyles.mainheaderContainer}>
            <TerminalBar>
              {postData.title}
            </TerminalBar>
          </div>
          <div className={utilStyles.mainbodyContainer}>
            <h1>{postData.title}</h1>
            <div>
              <h2>{postData.date}</h2>
            </div>
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
          </div>
          <div className={utilStyles.mainfooterContainer}>mainfooter</div>
        </div>
        <div className={utilStyles.mainsidebarContainer}>
          <TerminalBar>
            TABLE OF CONTENTS
          </TerminalBar>
          <div className={utilStyles.mainsidebarTOCContainer}>
            <TableOfContents></TableOfContents>
          </div>
        </div>
      </main>
      {/* <footer className={utilStyles.footerContainer}>
        <h1>footer</h1>
        <p>Et non occaecat pariatur ea mollit Lorem. Qui cupidatat nulla aliqua incididunt. Adipisicing laboris consectetur elit in minim eu sunt occaecat et cupidatat aliquip fugiat ea. Ad nisi cillum non consequat tempor laborum velit id dolore ullamco incididunt fugiat. Consectetur sunt nostrud consectetur aute ea occaecat dolor.</p>
      </footer> */}
      {/* <div className={utilStyles.appContainer}>
        <main className={`${utilStyles.mainContainer} ${utilStyles.mainContainer__gridArea}`}>
          <h1>{postData.title}</h1>
          <div>
            <h2>{postData.date}</h2>
          </div>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </main>
        <TableOfContents style={utilStyles.mainsidebarContainer} />
      </div> */}
    </>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData
    }
  };
}