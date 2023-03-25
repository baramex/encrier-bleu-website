import { useRef, useState } from "react";

export function LabelledSwitch({ states }) {
    const [state, setState] = useState(states[0]);
    const grid = useRef();

    return (
        <div ref={grid} className="grid grid-cols-[auto_auto] rounded-full text-gray-800 font-medium items-center bg-indigo-400 relative">
            {
                states.map((s, i) => <button onClick={() => setState(states[i])} className="z-10 px-5 py-3 outline-none">
                    <p>{s}</p>
                </button>)
            }
            <div style={{ left: grid.current?.children[states.indexOf(state)]?.offsetLeft, width: grid.current?.children[states.indexOf(state)]?.clientWidth }} className="z-0 transition-all absolute h-full top-0 ring-2 ring-indigo-600 bg-indigo-500/50 rounded-full"></div>
        </div>
    );
}