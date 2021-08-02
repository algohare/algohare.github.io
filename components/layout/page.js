import Layout from './default';
import utilStyles from '../../styles/utils.module.scss';
import TerminalBar from '../../components/terminalBar';

function Page({title, children}) {
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
          </div>
          <div className={utilStyles.mainfooterContainer}>mainfooter</div>
        </div>
      </div>
      </>
    </Layout>
  );
}

export default Page;