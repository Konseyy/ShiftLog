import { ShiftsScene, DataScene, SettingsScene } from "./components/TabStacks";
import ShiftList from "./components/ShiftTab/ShiftList";
import AddShift from "./components/ShiftTab/AddShift";
import DataOptions from "./components/DataTab/DataOptions";
import SettingsMain from "./components/SettingsTab/SettingsMain";
import MakeReport from "./components/DataTab/MakeReport";
import MakeBackup from "./components/DataTab/MakeBackup";
export const Tabs = [
    {
        name: "Shifts",
        component: ShiftsScene,
    },
    {
        name: "Data",
        component: DataScene ,
    },
    {
        name: "Settings",
        component: SettingsScene ,
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
export const DataTab = [
    {
        name:"DataOptions",
        component:DataOptions,
        options:{
            title:"Data"
        }
    },
    {
        name:"MakeReport",
        component:MakeReport,
        options:{
            title:"New Report"
        }
    },
    {
        name:"MakeBackup",
        component:MakeBackup,
        options:{
            title:"Generate Backup"
        }
    },
]
export const SettingsTab = [
    {
        name:"SettingsMain",
        component:SettingsMain,
        options:{
            title:"Settings"
        }
    },
]
