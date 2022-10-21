import React, {FC} from "react";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

import classes from "./Post.module.scss";

const PostSkeleton:FC = () => {
  return (
    <div className={classes.skeleton}>
      <Stack spacing={1}>
        <Skeleton variant="rectangular" width="100%" height={300} />
        <div className={classes.skeletonContent}>
          <div className={classes.skeletonUser}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              style={{ marginRight: 10 }}
            />
            <div className={classes.skeletonUserDetails}>
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="text" width={100} height={15} />
            </div>
          </div>
          <div className={classes.skeletonInfo}>
            <Skeleton variant="text" width="80%" height={45} />
            <div className={classes.skeletonTags}>
              <Skeleton variant="text" width={40} height={30} />
              <Skeleton variant="text" width={40} height={30} />
              <Skeleton variant="text" width={40} height={30} />
            </div>
          </div>
        </div>
      </Stack>
    </div>
  );
};

export default PostSkeleton;
