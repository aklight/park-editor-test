import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const SEARCH_API = 'https://npgallery.nps.gov/api/Search/Execute';
const PARK_LIST_API =
  'http://npgallery.nps.gov/api/List/Get/unitnamecodealllist?format=json&cached=true';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    dense: {
      marginTop: 19
    },
    menu: {
      width: 200
    }
  })
);

interface State {
  keyword: string;
}

const NPGalleryPicker = () => {
  const classes = useStyles();
  const [parks, setParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState('Yellowstone National Park');
  const [selectedParkAttr, setSelectedParkAttr] = useState('YELL');
  const [assets, setAssets] = useState([]);
  const [values, setValues] = React.useState<State>({
    keyword: ''
  });

  useEffect(() => {
    axios(PARK_LIST_API)
      .then((res) => {
        setParks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSelectChange = (event: any) => {
    setSelectedPark(event.target.value);
    const parkAttr = parks.filter((park) => {
      console.log(selectedPark);
      if (park[0] === selectedPark) {
        return park[1];
      }
    });
    setSelectedParkAttr(parkAttr[0][1]);
    axios
      .post(SEARCH_API, {
        search: {
          SearchID: null,
          TypeFilter: ['Album'],
          Operand: {
            LeftOperand: {
              Term: 'UnitCode',
              Attribute: selectedParkAttr,
              MatchType: 'Exact'
            },
            RightOperand: {
              Term: 'keywords',
              Attribute: values.keyword,
              ContainsType: 'All Words'
            },
            Operator: 'AND'
          },
          ActionFilter: 'Search',
          CacheResults: false,
          Save: true,
          RoleFilter: null,
          SubmitterFilter: null,
          StatusFilter: 'Active',
          SortTerms: [
            {
              Term: 'SubmittedDateTime',
              Ascending: false
            }
          ],
          PageSize: 50,
          ResultTerms: ['Title', 'Description'],
          CurrentPage: 1,
          PageCount: 0
        }
      })
      .then((res) => {
        setAssets(res.data.Results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChange = (keyword: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({ ...values, [keyword]: event.target.value });
    axios
      .post(SEARCH_API, {
        search: {
          SearchID: null,
          TypeFilter: ['Album'],
          Operand: {
            LeftOperand: {
              Term: 'UnitCode',
              Attribute: selectedParkAttr,
              MatchType: 'Exact'
            },
            RightOperand: {
              Term: 'keywords',
              Attribute: values.keyword,
              ContainsType: 'All Words'
            },
            Operator: 'AND'
          },
          ActionFilter: 'Search',
          CacheResults: false,
          Save: true,
          RoleFilter: null,
          SubmitterFilter: null,
          StatusFilter: 'Active',
          SortTerms: [
            {
              Term: 'SubmittedDateTime',
              Ascending: false
            }
          ],
          PageSize: 50,
          ResultTerms: ['Title', 'Description'],
          CurrentPage: 1,
          PageCount: 0
        }
      })
      .then((res) => {
        setAssets(res.data.Results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <Container maxWidth='sm'>
        <Typography
          component='div'
          style={{
            backgroundColor: 'white',
            height: '50vh',
            marginTop: '50px'
          }}
        >
          {' '}
          <form className={classes.root} autoComplete='off'>
            <TextField
              id='standard-search'
              label='Search field'
              onChange={handleInputChange('keyword')}
              type='search'
              className={classes.textField}
              margin='normal'
            />
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor='park-names'>Park name</InputLabel>
              <Select
                onChange={handleSelectChange}
                value={selectedPark}
                inputProps={{
                  name: selectedPark,
                  id: 'park-names'
                }}
              >
                {' '}
                {parks.map((park: string[]) => {
                  return (
                    <MenuItem key={park[1]} value={park[0]}>
                      {park[0]}
                    </MenuItem>
                  );
                })}{' '}
              </Select>
            </FormControl>
          </form>
        </Typography>
        {assets.map((item: any) => {
          return (
            <img
              key={item.Asset.AssetID}
              src={`http://npgallery.nps.gov/GetAsset/${
                item.Asset.AssetID
              }/Thumb/Large}`}
            />
          );
        })}
      </Container>
    </React.Fragment>
  );
};

export default NPGalleryPicker;
