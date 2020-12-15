import logo from './logo.svg';
import './App.css';
import groups from "./data";
import activities from "./data";
import { act } from 'react-dom/test-utils';
import { useState } from 'react';

function App() {
  const [group, setGroup] = useState(1);

  function changeGroup(e) {
      setGroup(group=>group = e.target.value);
  }
  let grouplist = [];
  let activitylist = {};
  groups.groups.forEach(element => {
    grouplist.push(element);
    activitylist[element] = [];
  });
  activities.activities.forEach(element => {
    activitylist[element["group"]][element["slot"]] = element["room"] + " " + element["class"];
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <select id="chooseClass" className="form-control w-25" onChange={setGroup}>
          {grouplist.map((val, idx) =>
            <option key={idx}>{val}</option>)}
        </select>
        <div >
          <div className="btn-row">
            <button className="text" itemType="button">Godzina</button>
            <button className="text" itemType="button">Pon</button>
            <button className="text" itemType="button">Wt</button>
            <button className="text" itemType="button">Sr</button>
            <button className="text" itemType="button">Czw</button>
            <button className="text" itemType="button">Pt</button>
          </div>
          <div id="items">
            {getSlots(activitylist, grouplist)}
          </div>
        </div>
      </header>
    </div>
  );
}



function getSlots(activitylist, grouplist) {
  let gr = document.getElementById("chooseClass");
  let arr = [1, 2, 3, 4, 5];
  let aaa = ["8:00-8:45", "8:55-9:40", "9:50-11:35", "11:55:12:40", "12:50:13:35", "13:45:14:30", "14:40-15:25",
    "15:35-16:20", "16:30-17:15"];
  let list = []
  let it = -5;
  if (gr == null) {
    console.log("ok?");
    list = activitylist["1a"];

  }
  else {
    list = activitylist[gr.value];
  }
  return (
    <div>
      { aaa.map((item) => {
        it += 5;
        return (
          <div className="btn-row">
            <button className="text" itemType="button">{item}</button>
            {arr.map((val) => {
              return getSlot(val, list, it);
              //console.log(getSlot(val, list));
            })}
          </div>)

      })}
    </div>
  )
}

function getSlot(slot, items, it) {
  if (items[slot + it] == undefined) {
    return (
      <button className="slot" id={slot + it}> </button>
    )
  }
  else {
    return (
      <button className="slot" id={slot + it}>{items[slot + it]}</button>
    )

  }
}

export default App;
