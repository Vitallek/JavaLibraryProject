import React from 'react';
import { Stack }from '@mui/material';
import BoxCard from './BoxCard';
// import { AddArticleDialog } from '../Dialogs/AddArticleDialog';

const BoxesStack = ({filteredWarehouse, article, warehouse, setWarehouse}) => {
    return (
        <Stack direction="row" sx={{p:1, flexWrap: 'wrap'}}>
          {/* <AddArticleDialog 
            open={open} 
            addArticleShowDialog={addArticleShowDialog} 
            warehouse={warehouse} 
            setWarehouse={setWarehouse} 
          /> */}
          
          {filteredWarehouse.map(element => {
            return(
              <BoxCard 
                key={element.box} 
                box={element} 
                selectedArticle={article}
                warehouse={warehouse}
                setWarehouse={setWarehouse}
              />
            )
          })}
        </Stack>
    );
}

export default BoxesStack