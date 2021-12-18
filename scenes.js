import ShiftsScene from "./components/ShiftsScene";
import ShiftList from "./components/ShiftTab/ShiftList";
import AddShift from "./components/ShiftTab/AddShift";
export const tabs = [
    {
        name: "Shifts",
        component: ShiftsScene,
    },
    {
        name: "Data",
        component: ShiftsScene ,
    },
    {
        name: "Settings",
        component: ShiftsScene ,
    },
];
export const ShiftTab = [
    {
        name:"ShiftList",
        component:ShiftList,
        options:{
            title:"Archive"
        }
    },
    {
        name:"AddShift",
        component:AddShift
    },
    
]
