import Link from 'next/link';
import headerStyles from './index.module.css'

function Header() {
  return (
    <>
      <div className={`${headerStyles.headerContainer}`}>
        <div className={headerStyles.headerText}>
          <Link href="/">
            Algohare
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header;