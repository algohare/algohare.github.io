import Link from 'next/link';
import headerStyles from './index.module.scss'

function Header() {
  return (
    <nav className={`${headerStyles.headerContainer}`}>
      <div className={headerStyles.headerText}>
        <Link href="/">
          Algohare
        </Link>
      </div>
      <div>
        <Link href="/categories">
          Categories
        </Link>
        <Link href="/about">
          About
        </Link>
      </div>
    </nav>
  )
}

export default Header;