import { createMuiTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const ListTheme = createMuiTheme({
  palette: {
      primary: { 
        main: '#00BFFE',
        contrastText: '#fff',
      },
      secondary: { 
        main: grey[300],
        contrastText: '#fff',
      }
  },
});

const PantryTheme = createMuiTheme({
  palette: {
      primary: { 
        main: '#1E90FF',
        contrastText: '#fff',
      },
      secondary: { 
        main: grey[300],
        contrastText: '#fff',
      }
  },
});

const RecipesTheme = createMuiTheme({
    palette: {
        primary: { 
          main: '#0000CF',
          contrastText: '#fff',
        },
        secondary: { 
          main: grey[400],
          contrastText: '#fff',
        }
    },
});

const Themes = {
  PantryTheme,
  ListTheme,
  RecipesTheme
};

export default Themes;


