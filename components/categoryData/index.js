import moment from 'moment';
import Link from 'next/link';
import cdStyle from './index.module.scss';
import Rabbit from '../listitem/rabbit';
import Carrot from '../listitem/carrot';

function CategoryData({categoryData}) {
  return (
    <div className={cdStyle.container}>
      {
        categoryData.titleArray.map((titleData, index) => {
          return (
            <Link key={index} href={titleData.href}>{titleData.title}</Link>
          )
        }).reduce((p, c) => [p, ' > ', c])
      }
      <ul>
        {categoryData.sortedPostDataArray.map((postData, index) => {
          return (
            <li key={index} className={categoryData.activeIndex === index ? cdStyle.active : ""} >
              <Link href={postData.href}>
                <a style={{display: 'flex'}}>
                  {categoryData.activeIndex === index ? <Rabbit /> : <Carrot />}
                  <div style={{alignSelf: 'center'}}>
                    {postData.title}
                  </div>
                </a>
              </Link>
              {/* <div>{moment(postData.date).format('YYYY-MM-DD')}</div> */}
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default CategoryData;