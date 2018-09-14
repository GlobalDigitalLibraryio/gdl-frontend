// @flow

const BLOCK_TAGS = {
  p: 'paragraph',
  h1: 'heading-one'
};

const MARK_TAGS = {
  em: 'italic',
  i: 'italic',
  b: 'bold',
  strong: 'bold'
};

export const schema = {
  blocks: {
    image: {
      isVoid: true,
      data: {
        src: v => v /*isUrl(v)*/,
        alt: v => typeof v === 'string'
      }
    },
    a: {
      data: {
        href: v => v /* isUrl(v) */
      }
    }
  }
};

const rules = [
  /**
   * Rules that handles blocks
   */
  {
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'p') {
        console.log(el.childNodes);
        return {
          object: 'block',
          type: 'paragraph',
          nodes: next(el.childNodes)
        };
      } else if (el.tagName.toLowerCase() === 'h1') {
        return {
          object: 'block',
          type: 'paragraph',
          nodes: next(el.childNodes)
        };
      } else if (el.tagName.toLowerCase() === 'img') {
        return {
          object: 'block',
          type: 'image',
          //nodes: next(el.childNodes),
          data: {
            src: el.getAttribute('src'),
            alt: el.getAttribute('alt')
          }
        };
      }
    }
  },
  /**
   * Rules that handles inlines
   */
  {
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'a') {
        return {
          object: 'inline',
          type: 'link',
          nodes: next(el.childNodes),
          data: {
            href: el.getAttribute('href')
          }
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === 'inline') {
        switch (obj.type) {
          case 'a':
            return <a href={obj.data.get('href')}>{children}</a>;
          default:
            throw new Error('Unknown type of inline');
        }
      }
    }
  },
  /**
   * Rules that handles marks
   */
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: 'mark',
          type,
          nodes: next(el.childNodes)
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>;
          case 'italic':
            return <em>{children}</em>;
          default:
            throw new Error('Unknown type of mark');
        }
      }
    }
  }
];

export default rules;
