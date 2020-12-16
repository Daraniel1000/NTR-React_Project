import './App.css';
import data from "./data";
import { useState, Component } from 'react';

function App() {
  const [state, setState] = useState({ view: 1, group: 1, teacher: 0 });
  function changeView(e) {
    setState(st => st = { view: e.target.id, group: 1, teacher: 0 });
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="btn-row">
          <button id="1" onClick={changeView}>tutaj będzie</button>
          <button id="2" onClick={changeView}>zmiana tego tam</button>
        </div>
        {renderView(state, setState)}
      </header>
    </div>
  );
}

function renderView(state, setState) {
  switch (state.view) {
    default:
      return (
        <div>
          {renderMain(state, setState)}
        </div>
      )
    case "2":
      return (
        <div>
          {renderTeachers(state, setState)}
        </div>
      )
  }
}

function renderTeachers(state, setState) {
  function changeTeacher(e) {
    setState(state => state = { view: state.view, teacher: e.target.selectedIndex, group: state.group });
  }
  function editTeacher(e) {
    data.teachers[state.teacher] = e.target.value;
    setState(st => st = { view: state.view, teacher: state.teacher, group: state.group, refresh: true });
  }
  function removeTeacher(e) {
    data.teachers.splice(state.teacher, 1);
    if (state.teacher >= data.teachers.length) {
      setState(st => st = { view: state.view, teacher: 0, group: state.group, refresh: true });
    }
    else {
      setState(st => st = { view: state.view, teacher: state.teacher, group: state.group, refresh: true });
    }
  }
  function addTeacher(e) {
    let s = document.getElementById("addName");
    data.teachers.push(s.value);
    s.value = "";
    setState(st => st = { view: state.view, teacher: state.teacher, group: state.group, refresh: true });
  }
  return (
    <div>
      <div>
        <select id="chooseTeacher" className="form-control w-100" onChange={changeTeacher}>
          {data.teachers.map((val) =>
            <option>{val}</option>)}
        </select>
        <input type="text" value={data.teachers[state.teacher]} onChange={editTeacher} />
        <button onClick={removeTeacher} className="btn btn-danger">usuń</button>
      </div>
      <div>
        <input type="text" id="addName" />
        <button onClick={addTeacher} className="btn btn-primary">dodaj</button>
      </div>
    </div>
  )
}

function renderMain(state, setState) {
  function changeGroup(e) {
    setState(st => st = { view: state.view, teacher: state.teacher, group: e.target.value });
  }
  let topRow = ["Godzina", "Pon", "Wt", "Śr", "Czw", "Pt"];
  let activitylist = {};
  data.groups.forEach(element => {
    activitylist[element] = [];
  });
  data.activities.forEach(element => {
    activitylist[element["group"]][element["slot"]] = element["room"] + " " + element["class"];
  });
  return (
    <div>
      <select id="chooseClass" className="form-control w-25" onChange={changeGroup}>
        {data.groups.map((val) =>
          <option>{val}</option>)}
      </select>
      <div >
        <div className="btn-row">
          {topRow.map(element =>
            <button className="text" itemType="button">{element}</button>)}
        </div>
        <div id="items">
          {getSlots(activitylist, state.group)}
        </div>
      </div>
    </div>
  )
}


function getSlots(activitylist, group) {
  let arr = [1, 2, 3, 4, 5];
  let hours = ["8:00-8:45", "8:55-9:40", "9:50-11:35", "11:55:12:40", "12:50:13:35", "13:45:14:30", "14:40-15:25",
    "15:35-16:20", "16:30-17:15"];
  let list = []
  let it = -5;
  if (typeof (group) != 'string') {
    list = activitylist["1a"];
  }
  else {
    list = activitylist[group];
  }
  return (
    <div>
      { hours.map((item) => {
        it += 5;
        return (
          <div className="btn-row">
            <button className="text" itemType="button">{item}</button>
            {arr.map((val) => {
              return getSlot(val, list, it);
            })}
          </div>)
      })}
    </div>
  )
}

function getSlot(slot, items, it) {
  if (items[slot + it] == undefined) {
    return (
      <button className="slot" id={slot + it}>wolne</button>
    )
  }
  else {
    return (
      <button className="slot" id={slot + it} >{items[slot + it]}</button>
    )
  }
}

export default App;
