import React from "react";
import PropTypes from "prop-types";
import MaterialTable from "material-table";
import {
  Search,
  ViewColumn,
  SaveAlt,
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
  Check,
  FilterList,
  Remove
} from "@material-ui/icons";
import { Add, Edit, Delete } from "@material-ui/icons";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";

// https://github.com/mbrn/material-table/issues/188
const ActionIconComponent = props => <div>{props.icon}</div>;

/*
  TODO #1
  Trace and document the purpose of each state property
*/
export default class DataEntryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data.slice(),
      //copy of state data from parent
      addEditOpen: false,
      //ensures default of edit window is not open
      addEditMode: "Add",
      //creates a mode for the window being opened (like a format)
      addEditError: "",
      //error handler for empty input values
      deleteOpen: false,
      //delete window default is not open
      actionID: "",
      //id of the current action
      working: {},
      //used to get expandable data from original
      original: {}
      //where the original data is placed
    };
  }

  /*
    Add, edit and delete material-table button click event handlers
  */
  onAddClick = () => {
    console.log("Add");
    const working = {};
    this.props.columns.map((col, idx) => (working[col.field] = col.default));
    /*
      TODO #2
      Research and document the purpose of the ES6 spread operator

      purpose of the spread operator is to get an expandable version of original that separates on each element or object
    */
    const original = { ...working };
    this.setState({ addEditOpen: true, addEditMode: "Add", working, original });
  };
  onEditClick = (e, rowData) => {
    console.log("Edit:", rowData[this.props.idField]);
    /*
      TODO #3: 
      Explain the purpose of the following filter, and the 
      subsequent usage of data as data[0]

      purpose of filter is to get the data from the row selected;
      purpose of data[0] is to get the selected row;
    */
    let data = this.state.data.filter(
      val => val[this.props.idField] === rowData[this.props.idField]
    );
    delete data[0]["tableData"]; // Mystery: inserted by material-table or React?
    const working = data[0];
    const original = { ...working };
    this.setState({
      addEditOpen: true,
      addEditMode: "Edit",
      actionID: rowData[this.props.idField],
      working,
      original
    });
  };
  onDeleteClick = (e, rowData) => {
    console.log("Delete:", rowData[this.props.idField]);
    this.setState({ deleteOpen: true, actionID: rowData[this.props.idField] });
  };
  /*
    Add/edit dialog save button event handler
  */
  onDialogSave = () => {
    console.log("OnDialogSave");
    /* 
      TODO #4
      Implement dialog save action for add or edit
      Note: You will also need to update Student.js
    */
    // const { working } = this.state;
    if (this.state.addEditMode === "Edit") {
      this.props.editCallback(this.state.working, this.state.original.id);
    } else {
      this.props.addCallback(this.state.working);
    }
  };
  onDialogDelete = () => {
    console.log("onDialogDelete");
    /* 
      TODO #5
      Implement dialog delete action
      Note: You will also need to update Student.js
    */
    this.props.deleteCallback(this.state.actionID);
  };
  onDialogReset = () => {
    console.log("onDialogReset");
    const working = this.state.working;
    const original = this.state.original;
    this.props.columns.map((col, idx) => {
      working[col.field] = original[col.field];
    });
    this.setState({ working, original });
  };
  /*
    Generic dialog cancel button event handler
  */
  onDialogCancel = event => {
    console.log("Dialog cancel");
    this.setState({ addEditOpen: false, deleteOpen: false });
  };
  /*
    Create add/edit dialog box form controls
  */
  createFormControls = () => {
    console.log("Create form controls: ", this.state.addEditMode);
    /* 
      TODO #6
      Research and explain the purpose of this method and how
      the method works

      this method creates form labels for each item in the row
    */
    const controls = this.props.columns.map((col, idx) => {
      let ctl = null;
      const working = this.state.working;
      switch (col.type) {
        case "boolean":
          ctl = (
            <FormControlLabel
              key={col.title + idx}
              control={
                <Checkbox
                  id={col.field}
                  name={col.field}
                  color="primary"
                  onClick={e => {
                    const { name, checked } = e.target;
                    const working = { ...this.state.working };
                    working[name] = checked;
                    this.setState({ working });
                  }}
                  checked={working[col.field]}
                />
              }
              label={col.title}
              labelPlacement="end"
            />
          );
          break;
        default:
          let ctype = "input";
          if (col.type === "numeric") ctype = "number";
          ctl = (
            <TextField
              key={col.title + idx}
              autoFocus={idx === 0 ? true : false}
              margin="dense"
              id={col.field}
              name={col.field}
              label={col.title}
              type={ctype}
              onChange={e => {
                const { name, value } = e.target;
                const working = { ...this.state.working };
                working[name] = value;
                this.setState({ working });
              }}
              value={working[col.field]}
              fullWidth
            />
          );
      }
      return ctl;
    });
    return controls;
  };
  /*
    Create add/edit dialog
  */
  createAddEditDialog = () => {
    console.log("Create edit dialog");
    if (this.state.addEditOpen) {
      return (
        <Dialog open={this.state.addEditOpen} aria-labelledby="dialog-add-edit">
          <DialogTitle id="dialog-add-edit">
            {this.state.addEditMode + " " + this.props.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText />
            {this.createFormControls()}
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.onDialogCancel}>
              Cancel
            </Button>
            <Button color="secondary" onClick={this.onDialogReset}>
              Reset
            </Button>
            <Button color="primary" onClick={this.onDialogSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else {
      return null;
    }
  };
  /*
    Create delete dialog
  */
  createDeleteDialog = () => {
    console.log("Create delete dialog");
    if (this.state.deleteOpen) {
      return (
        <Dialog open={this.state.deleteOpen} aria-labelledby="dialog-delete">
          <DialogTitle id="dialog-delete">
            Delete {this.props.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete{" "}
              {this.props.title + " " + this.state.actionID}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.onDialogCancel}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.onDialogDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else {
      return null;
    }
  };
  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate");
    if (prevProps.data !== this.props.data) {
      console.log("Data changes");
      this.setState({ addEditOpen: false, deleteOpen: false });
    }
  }
  render() {
    console.log("render");
    // console.log(JSON.stringify(this.state.data));
    return (
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          columns={this.props.columns}
          data={this.props.data}
          title="Student Information"
          options={{
            actionsColumnIndex: -1,
            columnsButton: true,
            exportButton: true
          }}
          icons={{
            Check: Check,
            DetailPanel: ChevronRight,
            Export: SaveAlt,
            Filter: FilterList,
            FirstPage: FirstPage,
            LastPage: LastPage,
            NextPage: ChevronRight,
            PreviousPage: ChevronLeft,
            Search: Search,
            ThirdStateCheck: Remove,
            ViewColumn: ViewColumn
          }}
          actions={[
            {
              icon: ActionIconComponent,
              iconProps: { icon: <Add /> },
              tooltip: "Add",
              onClick: this.onAddClick,
              isFreeAction: true
            },
            {
              icon: ActionIconComponent,
              iconProps: { icon: <Edit /> },
              tooltip: "Edit",
              onClick: this.onEditClick
            },
            {
              icon: ActionIconComponent,
              iconProps: { icon: <Delete /> },
              tooltip: "Delete",
              onClick: this.onDeleteClick
            }
          ]}
        />
        {/* 
            TODO #7
            Explain how we are able to call thse methods but not have
            both of the dialogs appear

            these methods are created for the dialog windows for each action;
            they are manually being called within each function;
        */}
        {this.createDeleteDialog()}
        {this.createAddEditDialog()}
      </div>
    );
  }
}
/* 
  TODO #8
  Use the import statement at the top of this file to import PropTypes
*/
/* 
  TODO #9
  Implement PropTypes for all properties passed into DataEntryList
  Note that all properties are required but title
*/

DataEntryList.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  addCallback: PropTypes.func.isRequired,
  editCallback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired
};

/* 
  TODO #10
  Implement default PropTypes and a default value of "DataEntryList" for the
  title property
*/

DataEntryList.defaultProps = {
  title: "DataEntryList"
};

/* 
  Extra Credit #1
  Locate the material-table actions property and add the Show Columns
  and Export actions
*/
/*
  Extra credit #2
  Implement error highlighting in add/edit dialog for required data elements
*/
