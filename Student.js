import React from "react";
import DataEntryList from "./DataEntryList.js";

const studentColumns = [
  { title: "UO ID", field: "id", type: "string", default: "", required: true },
  {
    title: "First",
    field: "first",
    type: "string",
    default: "",
    required: false
  },
  { title: "Last", field: "last", type: "string", default: "", required: true },
  {
    title: "Age",
    field: "age",
    type: "numeric",
    default: "",
    min: 1,
    max: 130,
    required: false
  },
  {
    title: "UO Student",
    field: "student",
    type: "boolean",
    default: true,
    required: false
  }
];
const studentIdField = "id";
const studentTitle = "Student";
const testData = [
  {
    id: "1000",
    first: "First1",
    last: "Last1",
    age: 21,
    student: true
  },
  {
    id: "2000",
    first: "First2",
    last: "Last2",
    age: 31,
    student: false
  }
];

export default class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: testData
    };
  }
  /*
    TODO
    You will need to implement these two methods
  */
  addCallback = info => {
    const data = this.state.data.slice();
    data.push(info);
    this.setState({ data });
  };
  editCallback = (info, id) => {
    const data = this.state.data.slice();
    // data = [...this.state.data];
    let index = data.findIndex(el => el.id === id);
    data[index] = info;
    this.setState({ data });
  };
  deleteCallback = id => {
    const data = this.state.data
      .slice()
      .filter(val => val[studentIdField] !== id);
    this.setState({ data });
  };
  render() {
    return (
      <React.Fragment>
        <DataEntryList
          columns={studentColumns}
          data={this.state.data}
          title={studentTitle}
          idField={studentIdField}
          addCallback={this.addCallback}
          editCallback={this.editCallback}
          deleteCallback={this.deleteCallback}
        />
      </React.Fragment>
    );
  }
}
