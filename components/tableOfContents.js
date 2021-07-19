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

const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState([]);

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll("h2, h3")
    ).filter(x => x.id !== "");

    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
}

const getNestedHeadings = (headingElements) => {
  const nestedHeadings = [];

  headingElements.forEach((heading, index) => {
    const { innerText: title, id } = heading;
    if (heading.nodeName === "H2") {
      nestedHeadings.push({ id, title, items: [] });
    }
    else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id,
        title,
      });
    }
  });

  return nestedHeadings;
};


const useIntersectionObserver = (setActiveId) => {
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
      rootMargin: "-110px 0px -40% 0px",
      // rootMargin: "-110px 0px -110px 0px",
    });

    const headingElements = Array.from(document.querySelectorAll("h2, h3")).filter(x => x.id !== "");
    const headingId2Index = {};

    for (let i = 0; i < headingElements.length; ++i) {
      const element = headingElements[i];
      headingId2Index[element.id] = i;
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);
};


const TableOfContents = () => {
  const { nestedHeadings } = useHeadingsData();
  const [activeId, setActiveId] = useState();
  useIntersectionObserver(setActiveId);

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
