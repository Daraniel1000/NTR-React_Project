import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [state, setState] = useState({ view: "4", group: "1a", teacher: 0, data: undefined });
  function changeView(e) {
    setState(st => st = { view: e.target.id, group: state.group, teacher: state.teacher, data: state.data });
  }
  useEffect(() => {
    //console.log(state);
    if (state.data === undefined) {
      fetch('http://localhost:3004/data')
        .then(res => res.json())
        .then((data) => {
          setState({ view: "1", group: "1a", teacher: 0, data: data })
        })
        .catch(console.log)
    }
    else {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/JSON' },
        body: JSON.stringify(state.data)
      };
      fetch('http://localhost:3004/data', requestOptions)
        .then(response => response.json());
        //.then(data => console.log(data));
    }
  })
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
    case "4":
      return (
        <h2>Ładowanie danych...</h2>
      )
      case 5:
        return(
          <h2 className="text-danger">Uwaga: nie można zduplikować nauczyciela</h2>
        )
  }
}

function groupFree(group, slot, activities) {
  let ret = true;
  activities.forEach(element => {
    if (element.slot == slot && element.group === group) {
      ret = false;
    }
  })
  return ret;
}
function roomFree(room, slot, activities) {
  let ret = true;
  activities.forEach(element => {
    if (element.slot == slot && element.room === room) {
      ret = false;
    }
  })
  return ret;
}
function teacherFree(teacher, slot, activities) {
  let ret = true;
  activities.forEach(element => {
    if (element.slot == slot && element.teacher === teacher) {
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
    let d = state.data;
    d.activities.push(activity);
    setState(st => st = { view: "1", group: state.group, teacher: state.teacher, data: d })
  }
  let slot = null;
  state.data.activities.forEach(element => {
    if (element["slot"] == state.slot && element["group"] === state.group) {
      slot = element;
    }
  });
  if (slot === null) {
    slot = { class: state.data.classes[0], group: state.group, room: state.data.rooms[0], slot: Number(state.slot), teacher: state.data.teachers[0] };
  }
  let grouplist = [], roomlist = [], teachlist = [];
  state.data.groups.forEach(element => {
    if (element === slot.group) {
      grouplist.push(element);
    }
    else {
      if (groupFree(element, slot.slot, state.data.activities)) {
        grouplist.push(element);
      }
    }
  })
  state.data.teachers.forEach(element => {
    if (element === slot.teacher) {
      teachlist.push(element);
    }
    else {
      if (teacherFree(element, slot.slot, state.data.activities)) {
        teachlist.push(element);
      }
    }
  })
  state.data.rooms.forEach(element => {
    if (element === slot.room) {
      roomlist.push(element);
    }
    else {
      if (roomFree(element, slot.slot, state.data.activities)) {
        roomlist.push(element);
      }
    }
  })
  return (
    <div>
      <select defaultValue={slot.class} id="class" className="form-control w-100">
        {state.data.classes.map(val => {
          return (<option>{val}</option>)
        })}
      </select>
      <select id="group" className="form-control w-100" defaultValue={slot.group}>
        {grouplist.map(val => {
          return (<option>{val}</option>)
        })}
      </select>
      <select id="room" className="form-control w-100" defaultValue={slot.room}>
        {roomlist.map(val => {
          return (<option>{val}</option>)
        })}
      </select>
      <select id="teacher" className="form-control w-100" defaultValue={slot.teacher}>
        {teachlist.map(val => {
          return (<option>{val}</option>)
        })}
      </select>
      <button className="btn btn-primary" onClick={saveSlot}>Zapisz</button>
    </div>
  )
}

function renderTeachers(state, setState) {
  function changeTeacher(e) {
    setState(state => state = { view: state.view, teacher: e.target.selectedIndex, group: state.group, data: state.data });
  }
  function editTeacher(e) {
    let b = false;
    state.data.teachers.forEach(teacher=>{
      if(e.target.value == teacher){
        b = true;
      }
    })
    if(b){
      setState(state=>state = {view: 5, teacher: state.teacher, group: state.group, data: state.data})
      return;
    }
    state.data.activities.forEach(activity => {
      if (activity.teacher === state.data.teachers[state.teacher]) {
        activity.teacher = e.target.value;
      }
    })
    state.data.teachers[state.teacher] = e.target.value;
    setState(st => st = { view: state.view, teacher: state.teacher, group: state.group, refresh: true, data: state.data });
  }
  function removeTeacher(e) {
    let teach = state.data.teachers[state.teacher]
    state.data.teachers.splice(state.teacher, 1);
    let d = state.data
    d.activities.forEach((activity, idx) => {
      if (activity.teacher === teach) {
        d.activities.splice(idx, 1);
      }
    })
    if (state.teacher >= d.teachers.length) {
      setState(st => st = { view: state.view, teacher: 0, group: state.group, refresh: true, data: d });
    }
    else {
      setState(st => st = { view: state.view, teacher: state.teacher, group: state.group, refresh: true, data: d });
    }
  }
  function addTeacher(e) {
    let s = document.getElementById("addName");
    let d = state.data;
    let b = true;
    d.teachers.forEach(teacher => {
      if (teacher == s.value) {
        b = false;
      }
    })
    if (b) {
      d.teachers.push(s.value);
      setState(st => st = { view: state.view, teacher: state.teacher, group: state.group, refresh: true, data: d });
    }
    else{
      setState(state=>state = {view: 5, teacher: e.target.selectedIndex, group: state.group, data: state.data})
    }
    s.value = "";
  }
  return (
    <div>
      <div>
        <select id="chooseTeacher" className="form-control w-100" onChange={changeTeacher} value={state.data.teachers[state.teacher]}>
          {state.data.teachers.map((val) =>
            <option>{val}</option>)}
        </select>
        <input type="text" value={state.data.teachers[state.teacher]} onChange={editTeacher} />
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
    setState(st => st = { view: state.view, teacher: state.teacher, group: e.target.value, data: state.data });
  }
  function editSlot(e) {
    setState(st => st = { view: "3", teacher: state.teacher, group: state.group, slot: e.target.id, data: state.data });
  }
  let topRow = ["Godzina", "Pon", "Wt", "Śr", "Czw", "Pt"];
  let activitylist = {};
  state.data.groups.forEach(element => {
    activitylist[element] = [];
  });
  state.data.activities.forEach(element => {
    activitylist[element["group"]][element["slot"]] = element["room"] + " " + element["class"];
  });
  return (
    <div>
      <select id="chooseClass" className="form-control w-25" onChange={changeGroup} value={state.group}>
        {state.data.groups.map((val) => {
          return (<option>{val}</option>)
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
