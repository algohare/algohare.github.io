import { useEffect, useRef, useState } from 'react';
import tocStyles from './tableOfContents.module.css';
import Rabbit from './listitem/rabbit';
import Carrot from './listitem/carrot';

const Headings = ({ headings, activeId }) => (
  <ul>
    {headings.map((heading) => (
      <li key={heading.id} className={heading.id === activeId ? tocStyles.active : ""}>
        <div className={tocStyles.item}>
          <a href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(`[id='${heading.id}']`).scrollIntoView({
                behavior: "smooth"
              });
            }}
          >
            <div style={{display: 'flex'}}>
              {heading.id === activeId ? <Rabbit /> : <Carrot />}
              <div style={{alignSelf: 'center'}}>
                {heading.title}
              </div>
            </div>
          </a>
        </div>
        {heading.items.length > 0 && (
          <ul>
            {heading.items.map((child) => (
              <li key={child.id} className={child.id === activeId ? tocStyles.active : ""}>
                <div className={tocStyles.item}>
                  <a href={`#${child.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(`[id='${child.id}']`).scrollIntoView({
                        behavior: "smooth"
                      });
                    }}
                  >
                    <div style={{display: 'flex'}}>
                      {child.id === activeId ? <Rabbit /> : <Carrot />}
                      <div style={{alignSelf: 'center'}}>
                        {child.title}
                      </div>
                    </div>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
);

const useHeadingsData = (title, contentSelector, headingSelector) => {
  const [nestedHeadings, setNestedHeadings] = useState([]);

  useEffect(() => {
    const newNestedHeadings = getNestedHeadings(contentSelector, headingSelector);
    setNestedHeadings(newNestedHeadings);
  // });
  }, [title]);

  return { nestedHeadings };
}

const getNestedHeadings = (contentSelector, headingSelector) => {
  const nestedHeadings = [];
  const headingElements = getHeadingElements(contentSelector, headingSelector);
  const headingSelectorArray = headingSelector.replace(' ', '').split(',');

  headingElements.forEach((heading, index) => {
    const { innerText: title, id } = heading;
    const idx = headingSelectorArray.indexOf(heading.nodeName.toLowerCase());
    let cur = nestedHeadings;
    for (let i = 0; i < idx; ++i) {
      cur = cur[cur.length-1].items;
    }
    cur.push({ id, title, items: []})
  });

  return nestedHeadings;
};


const useIntersectionObserver = (title, rootMargin, contentSelector, headingSelector, setActiveId) => {
  const headingElementsRef = useRef({});
  const prevActiveIdIndex = useRef(-1);
  useEffect(() => {
    const setActiveIdRange = (sidx, eidx) => {
      if (sidx <= eidx) {
        for (; sidx <= eidx; ++sidx) {
          setActiveId(sidx === -1 ? "" : headingElements[sidx].id);
        }
      }
      else {
        for (; sidx >= eidx; --sidx) {
          setActiveId(sidx === -1 ? "" : headingElements[sidx].id);
        }
      }
    };

    const callback = (headings) => {
      const sortedHeadings = headings.sort(
        (a, b) => {
          if (headingId2Index[a.target.id] === headingId2Index[b.target.id]) {
            return a.time - b.time;
          }
          else {
            return headingId2Index[a.target.id] - headingId2Index[b.target.id];
          }
        }
      );

      headingElementsRef.current = sortedHeadings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      if (visibleHeadings.length > 0) {
        setActiveIdRange(prevActiveIdIndex.current, headingId2Index[visibleHeadings[0].target.id]);
        prevActiveIdIndex.current = headingId2Index[visibleHeadings[0].target.id];
      }
      else {
        let i = 0;
        while (i < sortedHeadings.length && sortedHeadings[i].boundingClientRect.y < 110) ++i;
        --i;
        if (i !== -1) {
          setActiveIdRange(prevActiveIdIndex.current, headingId2Index[sortedHeadings[i].target.id]);
          prevActiveIdIndex.current = headingId2Index[sortedHeadings[i].target.id];
        }
        else {
          let index = headingId2Index[sortedHeadings[0].target.id] - 1;
          setActiveIdRange(prevActiveIdIndex.current, index);
          prevActiveIdIndex.current = index;
        }
      }

    }

    const observer = new IntersectionObserver(callback, {
      rootMargin
    });

    const headingElements = getHeadingElements(contentSelector, headingSelector)
    const headingId2Index = {};

    for (let i = 0; i < headingElements.length; ++i) {
      const element = headingElements[i];
      headingId2Index[element.id] = i;
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      headingElementsRef.current = {};
      prevActiveIdIndex.current = -1;
      // console.log(headingElementsRef);
    }
  // });
  }, [title]);
};


const getHeadingElements = (contentSelector, headingSelector) => {
  const headingElements = Array.from(
    document.querySelector(contentSelector).querySelectorAll(headingSelector)
  ).filter(x => x.id !== "");

  return headingElements;
}

const TableOfContents = ({title, contentSelector, headingSelector, rootMargin}) => {
  const { nestedHeadings } = useHeadingsData(title, contentSelector, headingSelector);
  const [activeId, setActiveId] = useState();
  useIntersectionObserver(title, rootMargin, contentSelector, headingSelector, setActiveId);

  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count+1);
  }, [activeId]);

  return (
    <nav className={`${tocStyles.nav}`} aria-label="Table of contents">
      <Headings headings={nestedHeadings} activeId={activeId} />
      <div>{count}</div>
    </nav>
  );
};

export default TableOfContents;
