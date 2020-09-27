import React, { useState } from "react";
import { Checkbox, Collapse } from "antd";

const { Panel } = Collapse;

export function CategoryCheckBox(props) {
  const [Checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    const currentIndex = Checked.indexOf(value);
    const newChecked = [...Checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
  };

  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <div style={{ display: "flex" }}>
          <Checkbox
            onChange={() => handleToggle(value._id)}
            type="checkbox"
            checked={Checked.indexOf(value._id) === -1 ? false : true}
          />
          <span>{value.name}</span>
        </div>
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="Categories" key="1">
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export function BrandCheckBox(props) {
  const [Checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    const currentIndex = Checked.indexOf(value);
    const newChecked = [...Checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
  };

  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <div style={{ diaplay: "flex" }}>
          <Checkbox
            onChange={() => handleToggle(value._id)}
            type="checkbox"
            checked={Checked.indexOf(value._id) === -1 ? false : true}
          />
          <span>{value.name}</span>
        </div>
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["1"]}>
        <Panel header="Brand" key="1">
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}
