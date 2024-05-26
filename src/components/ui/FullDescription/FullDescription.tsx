import React from 'react';
import Linkify from 'react-linkify';

import css from './index.module.css';

interface IProps {
  description: any
  className?: string
}

const FullDescription = ({description, className}: IProps) => {
  const [fullDesc, setFullDesc] = React.useState(false);

  return (
    <div className={`${css.collectionDescInner}${className ? ` ${className}` : ""}`}>
      <Linkify
        componentDecorator={(decoratedHref: any, decoratedText: any) => (
          <a
            key={decoratedText}
            href={decoratedHref}
            className={css.descLink}
          >
            {decoratedText}
          </a>
        )}
      >
        <p className={`${css.collectionDesc}${fullDesc ? ` ${css.full}` : ''}`}>
          {description}
        </p>
      </Linkify>

      <div
        className={css.collectionDescFull}
        onClick={() => setFullDesc((prev) => !prev)}
      >
        See {fullDesc ? 'less' : 'more'}

        {/*<img*/}
        {/*  src="/assets/img/arrow-top.svg"*/}
        {/*  alt="arrow"*/}
        {/*  className={`${css.collectionDescFullIcon}${fullDesc ? ` ${css.full}` : ''}`}*/}
        {/*/>*/}
      </div>
    </div>
  )
}

export default FullDescription;
