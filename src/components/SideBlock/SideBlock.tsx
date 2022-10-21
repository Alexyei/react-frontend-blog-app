import React, {FC} from "react";
import classes from "./SideBlock.module.scss";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const SideBlock:FC<{title:string, children:React.ReactNode}> = ({ title, children }) => {
  return (
    <Paper classes={{ root: classes.root }}>
      <Typography variant="h6" classes={{ root: classes.title }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

export default SideBlock;