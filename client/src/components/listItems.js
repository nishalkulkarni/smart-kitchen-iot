import React from "react";
import { Link } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import DashboardIcon from "@material-ui/icons/Dashboard";
import SearchIcon from "@material-ui/icons/Search";
import AddItemIcon from "@material-ui/icons/Add";
import ViewPhotosIcon from "@material-ui/icons/Visibility";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import AvTimerIcon from '@material-ui/icons/AvTimer';

export const mainListItems = (
  <div>
    <Link to="/">
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>

    <Link to="/inventory">
      <ListItem button>
        <ListItemIcon>
          <AllInboxIcon />
        </ListItemIcon>
        <ListItemText primary="Inventory" />
      </ListItem>
    </Link>

    <Link to="/search">
      <ListItem button>
        <ListItemIcon>
          <SearchIcon />
        </ListItemIcon>
        <ListItemText primary="Search For Recipes" />
      </ListItem>
    </Link>

    <Link to="/additem">
      <ListItem button>
        <ListItemIcon>
          <AddItemIcon />
        </ListItemIcon>
        <ListItemText primary="Add Item to Inventory" />
      </ListItem>
    </Link>

    <Link to="/cookingguide">
      <ListItem button>
        <ListItemIcon>
          <AvTimerIcon />
        </ListItemIcon>
        <ListItemText primary="Cooking Assistant" />
      </ListItem>
    </Link>

    <Link to="/viewphotos">
      <ListItem button>
        <ListItemIcon>
          <ViewPhotosIcon />
        </ListItemIcon>
        <ListItemText primary="View all Photos" />
      </ListItem>
    </Link>
  </div>
);
