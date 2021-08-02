import Header from '../../components/header';
import defaultStyles from './default.module.scss';

function Default({ children }) {
  return (
    <>
      <header className={defaultStyles.headerContainer}>
        <div>
          <Header/>
        </div>
      </header>
      <main className={defaultStyles.mainContainer}>
        <div>
          {children}
        </div>
      </main>
      {/* <footer className={utilStyles.footerContainer}>
        <h1>footer</h1>
        <p>Et non occaecat pariatur ea mollit Lorem. Qui cupidatat nulla aliqua incididunt. Adipisicing laboris consectetur elit in minim eu sunt occaecat et cupidatat aliquip fugiat ea. Ad nisi cillum non consequat tempor laborum velit id dolore ullamco incididunt fugiat. Consectetur sunt nostrud consectetur aute ea occaecat dolor.</p>
      </footer> */}
    </>
  )
}

export default Default;