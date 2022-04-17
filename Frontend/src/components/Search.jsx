import React, { useState } from 'react';
import { Box, IconButton, InputBase, Paper } from '@mui/material'

import SearchIcon from '@mui/icons-material/Search';

function Search(props) {
    const [input_search, setInput_search] = useState("");

    const handleSearch = () => {

        var search = new RegExp(input_search, 'i');
        let filteredList = props.storedData.filter((item) => {
            if(props.searchname){
                return search.test(item[props.searchname]);
            } else {
                return search.test(item.name);
            }
        });

        props.setData(filteredList);

    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb:2 }}>
            <Paper
                sx={{ p: '2px 4px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', maxWidth: 400 }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={props.label}
                    value={input_search}
                    onChange={(e)=>{setInput_search(e.target.value)}}
                />
                <IconButton sx={{ p: '10px' }} onClick={handleSearch}>
                    <SearchIcon />
                </IconButton>
            </Paper>
        </Box>
    )
}

export default Search