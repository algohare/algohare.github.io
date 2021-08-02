import Layout from './default';
import Link from 'next/link';
import utilStyles from '../../styles/utils.module.scss';
import TerminalBar from '../../components/terminalBar';
import CategoryData from '../../components/categoryData';
import TableOfContents from '../../components/tableOfContents';

function Post({title, categoryData, children}) {
  return (
    <Layout>
      <>
      <div className={utilStyles.mainContainer}>
        <div className={utilStyles.maincontentContainer}>
          <div className={utilStyles.mainheaderContainer}>
            <TerminalBar>
              {title}
            </TerminalBar>
          </div>
          <div className={utilStyles.mainbodyContainer}>
            {children}
            <hr/>
            <div className={utilStyles.mainCategoryContainer}>
              <CategoryData categoryData={categoryData} />
            </div>
          </div>
          <div className={utilStyles.mainfooterContainer}>mainfooter</div>
        </div>
        <div className={utilStyles.mainsidebarContainer}>
          <TerminalBar>
            TABLE OF CONTENTS
          </TerminalBar>
          <div className={utilStyles.mainsidebarTOCContainer}>
            <TableOfContents
              title={title}
              contentSelector={`.${utilStyles.mainbodyContainer}`}
              headingSelector="h2, h3"
              rootMargin="-110px 0px -40% 0px" />
          </div>
        </div>
      </div>
      </>
    </Layout>
  );
}

export default Post;