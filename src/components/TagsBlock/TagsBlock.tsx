import React, {FC} from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import SideBlock from "../SideBlock/SideBlock";
import {Link} from "react-router-dom";



const TagsBlock:FC<{isLoading:boolean,items:string[]}> = ({ items, isLoading = true }) => {
  return (
    <SideBlock title="Последние теги">
      <List>
        {(isLoading ? [...Array(5)] : items).map((name:typeof items[number]|undefined, i) => (
          <Link
              key={i}
            style={{ textDecoration: "none", color: "black" }}
            to={`/tag/${name}`}
          >
            <ListItem key={i} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </SideBlock>
  );
};

export default TagsBlock;
