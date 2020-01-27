import React from "react";
import ErrorBoundary from "./ErrorBoundary.js";
import Grid from "@material-ui/core/Grid";
import Student from "./Student.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onAddStudent = info => {
    const data = this.state.data.slice();
    //const { data } = this.state;
    data.push(info);
    this.setState({ data });
  };
  onCancelStudent = () => {
    this.setState({ addEditOpen: false, deleteOpen: false });
  };
  render() {
    return (
      <ErrorBoundary>
        <div className="App">
          <h1>CIT 382 19W Assignment 6</h1>
          <Grid container justify="center">
            <Student />
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }
}
