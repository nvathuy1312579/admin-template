import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';

const style = {
  grid: {
    margin: '0 -15px',
    width: 'calc(100% + 30px)',
  },
};

function GridContainer({ ...props }) {
  const { classes, children, className, ...rest } = props;
  return (
    <Grid container {...rest} className={classes.grid + ' ' + className}>
      {children}
    </Grid>
  );
}

GridContainer.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default withStyles(style)(GridContainer);
