import TextField from '@mui/material/TextField';

const SearchBar = ({ onSearch }) => {

  return (
    <TextField helperText=" "
  id="demo-helper-text-aligned-no-helper"
  label="Search" fullWidth
  onChange={onSearch} placeholder="Search By Name Email Role" />
  );

};

export default SearchBar;
