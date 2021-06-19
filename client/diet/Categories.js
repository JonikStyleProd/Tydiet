import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Icon from "@material-ui/core/Icon";
import { listSearch } from "./api-diet.js";
import DietSearch from "./DietSearch";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: '#cfd8dc',

  },
  gridList: {
    flexWrap: "nowrap",
    width: "100%",
    transform: "translateZ(0)",
    
  },
  tileTitle: {
    verticalAlign: "middle",
    lineHeight: 2.5,
    textAlign: "center",
    fontSize: "1.35em",
    margin: "0 4px 0 0",
  },
  card: {
    margin: "auto",
    marginTop: 20,
    backgroundColor: '#cfd8dc',
    boxShadow: '#00264d 0px 0px 20px 0px',
    border: "1px solid #2d668e",
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
    backgroundColor: "#80808024",
    fontSize: "1.1em",
  },
  icon: {
    verticalAlign: "sub",
    color: "#738272",
    fontSize: "0.9em",
  },
  link: {
    color: "#4d6538",
    textShadow: "0px 2px 12px #ffffff",
    cursor: "pointer",
  },
}));

export default function Categories(props) {
  const classes = useStyles();
  const [diets, setDiets] = useState([]);
  const [selected, setSelected] = useState(props.categories[0]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listSearch({
      category: props.categories[0],
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setDiets(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const listbyCategory = (category) => (event) => {
    setSelected(category);
    listSearch({
      category: category,
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setDiets(data);
      }
    });
  };

  return (
    <div>
      <Card className={classes.card}>
        <Typography type="title" className={classes.title}>
          Explore by category
        </Typography>
        <div className={classes.root}>
          <GridList className={classes.gridList} cols={4}>
            {props.categories.map((tile, i) => (
              <GridListTile
                key={i}
                className={classes.tileTitle}
                style={{
                  height: "64px",
                  backgroundColor:
                    selected == tile
                      ? "rgba(95, 139, 137, 0.56)"
                      : "rgba(95, 124, 139, 0.32)",
                }}
              >
                <span className={classes.link} onClick={listbyCategory(tile)}>
                  {tile}{" "}
                  <Icon className={classes.icon}>
                    {selected == tile && "arrow_drop_down"}
                  </Icon>
                </span>
              </GridListTile>
            ))}
          </GridList>
        </div>
        <Divider />
        <DietSearch diets={diets} searched={false} />
      </Card>
    </div>
  );
}
Categories.propTypes = {
  categories: PropTypes.array.isRequired,
};
