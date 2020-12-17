import './App.css';
import data from "./data";
import { useState, Component } from 'react';

function App() {
  const [state, setState] = useState({ view: "1", group: "1a", teacher: 0 });
  function changeView(e) {
    setState(st => st = { view: e.target.id, group: "1a", teacher: 0 });
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="btn-row">
          <button className="btn btn-white" id="1" onClick={changeView}>Plan lekcji</button>
          <button className="btn btn-white" id="2" onClick={changeView}>Nauczyciele</button>
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
    case "3":
      return (
        <div>
          {renderSlot(state, setState)}
        </div>
      )
  }
}

function groupFree(group, slot, activities) {
  let ret = true;
  activities.forEach(element => {
    if (element.slot === slot && element.group === group) {
      ret = false;
    }
  })
  return ret;
}
function roomFree(room, slot, activities) {
  let ret = true;
  activities.forEach(element => {
    if (element.slot === slot && element.room === room) {
      ret = false;
    }
  })
  return ret;
}
function teacherFree(teacher, slot, activities) {
  let ret = true;
  activities.forEach(element => {
    if (element.slot === slot && element.teacher === teacher) {
      ret = false;
    }
  })
  return ret;
}

function renderSlot(state, setState) {
  function saveSlot(e) {
    let subject = document.getElementById("class").value;
    let group = document.getElementById("group").value;
    let room = document.getElementById("room").value;
    let teacher = document.getElementById("teacher").value;
    let activity = { room: room, group: group, class: subject, slot: state.slot, teacher: teacher };
    data.activities.push(activity);
    setState(st => st = { view: "1", group: "1a", teacher: 0 })
  }
  let slot = null;
  data.activities.forEach(element => {
    if (element["slot"] == state.slot && element["group"] === state.group) {
      slot = element;
    }
  });
  if (slot === null) {
    slot = { class: data.classes[0], group: state.group, room: data.rooms[0], slot: Number(state.slot), teacher: data.teachers[0] };
  }
  let grouplist = [], roomlist = [], teachlist = [];
  data.groups.forEach(element => {
    if (element === slot.group) {
      grouplist.push(element);
    }
    else {
      if (groupFree(element, slot.slot, data.activities)) {
        grouplist.push(element);
      }
    }
  })
  data.teachers.forEach(element => {
    if (element === slot.teacher) {
      teachlist.push(element);
    }
    else {
      if (teacherFree(element, slot.slot, data.activities)) {
        teachlist.push(element);
      }
    }
  })
  data.rooms.forEach(element => {
    if (element === slot.room) {
      roomlist.push(element);
    }
    else {
      if (roomFree(element, slot.slot, data.activities)) {
        roomlist.push(element);
      }
    }
  })
  return (
    <div>
      <select id="class" className="form-control w-100">
        {data.classes.map(val => {
          if (val === slot.class) {
            return (<option selected>{val}</option>)
          }
          return (<option>{val}</option>)
        })}
      </select>
      <select id="group" className="form-control w-100">
        {grouplist.map(val => {
          if (val === slot.group) {
            return (<option selected>{val}</option>)
          }
          return (<option>{val}</option>)
        })}
      </select>
      <select id="room" className="form-control w-100">
        {roomlist.map(val => {
          if (val === slot.room) {
            return (<option selected>{val}</option>)
          }
          return (<option>{val}</option>)
        })}
      </select>
      <select id="teacher" className="form-control w-100">
        {teachlist.map(val => {
          if (val === slot.teacher) {
            return (<option selected>{val}</option>)
          }
          return (<option>{val}</option>)
        })}
      </select>
      <button className="btn btn-primary" onClick={saveSlot}>Zapisz</button>
    </div>
  )
}

function renderTeachers(state, setState) {
  function changeTeacher(e) {
    setState(state => state = { view: state.view, teacher: e.target.selectedIndex, group: state.group });
  }
  function editTeacher(e) {
    data.activities.forEach(activity=>{
      if(activity.teacher === data.teachers[state.teacher]){
        activity.teacher = e.target.value;
      }
    })
    data.teachers[state.teacher] = e.target.value;
    setState(st => st = { view: state.view, teacher: state.teacher, group: state.group, refresh: true });
  }
  function removeTeacher(e) {
    let teach = data.teachers[state.teacher]
    data.teachers.splice(state.teacher, 1);
    data.activities.forEach((activity, idx)=>{
      if(activity.teacher === teach){
        data.activities.splice(idx, 1);
      }
    })
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
  function editSlot(e) {
    setState(st => st = { view: "3", teacher: state.teacher, group: state.group, slot: e.target.id });
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
        {data.groups.map((val) => {
          if(state.group === val) return(<option selected>{val}</option>)
          else return(<option>{val}</option>)
        })}
      </select>
      <div >
        <div className="btn-row">
          {topRow.map(element =>
            <button className="text" itemType="button">{element}</button>)}
        </div>
        <div id="items">
          {getSlots(activitylist, state.group, editSlot)}
        </div>
      </div>
    </div>
  )
}


function getSlots(activitylist, group, editSlot) {
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
              return getSlot(val, list, it, editSlot);
            })}
          </div>)
      })}
    </div>
  )
}

function getSlot(slot, items, it, editSlot) {
  if (items[slot + it] == undefined) {
    return (
      <button itemType="button" className="slot" id={slot + it} onClick={editSlot}>.</button>
    )
  }
  else {
    return (
      <button itemType="button" className="slot" id={slot + it} onClick={editSlot}>{items[slot + it]}</button>
    )
  }
}

export default App;
