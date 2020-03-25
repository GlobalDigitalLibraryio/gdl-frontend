//@flow
import { Card } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import FeaturedEdit from './featuredEdit';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import type { FeaturedContent } from '../../types';

export default function FeatureAdd(
  defaultReturned: boolean,
  handleSaveButtonClick: (boolean, FeaturedContent) => void,
  handleFileChosen: (SyntheticInputEvent<EventTarget>) => void,
  handleOnCancel: () => void,
  file: ?File,
  handleOnUpload: (string, (string, any) => void) => void,
  featuredContentList: Array<FeaturedContent>,
  selectedLanguage: string
) {
  return (
    <FeaturedEdit
      button={
        <Card
          css={css`
            width: 296px;
            height: 450px;
            display: table;
            :hover {
              background-color: #aeb6e3;
            }
          `}
          key="addFeaturedCard"
        >
          <div
            style={{
              margin: 'auto',
              display: 'table-cell',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}
          >
            <Add
              style={{
                fontSize: 150,
                color: 'lightgray'
              }}
            />
            <p
              style={{ fontSize: 30, color: 'gray', fontFamily: 'sans-serif' }}
            >
              ADD
            </p>
          </div>
        </Card>
      }
      i={featuredContentList.length}
      featuredContentList={featuredContentList}
      defaultReturned={defaultReturned}
      handleSaveButtonClick={handleSaveButtonClick}
      handleFileChosen={handleFileChosen}
      handleOnCancel={handleOnCancel}
      file={file}
      handleOnUpload={handleOnUpload}
      selectedLanguage={selectedLanguage}
    />
  );
}
