import React from 'react';
import { Card } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import FeaturedEdit from './featuredEdit';

export default function FeatureAdd(
  defaultReturned: boolean,
  handleSaveButtonClick: any,
  handleFileChosen: any,
  handleOnCancel: any,
  file: any,
  handleOnUpload: any,
  featuredContentList: Array<any>
) {
  return (
    <FeaturedEdit
      button={
        <Card
          style={{ width: 296, height: 450, display: 'table' }}
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
    />
  );
}
