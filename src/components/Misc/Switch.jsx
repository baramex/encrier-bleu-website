import { useRef } from "react";

export function LabelledSwitch({ states, state, setState }) {
    const grid = useRef();

    const sliderWidth = grid.current && grid.current?.children[state]?.clientWidth;
    const sliderLeft = grid.current && grid.current?.children[state]?.offsetLeft;

    return (
        <div ref={grid} className="grid grid-cols-[auto_auto] rounded-full text-white font-medium items-center bg-[#13143b] relative">
            {
                states.map((s, i) => <button key={i} onClick={() => setState(i)} className="z-10 px-5 py-3 outline-none">
                    <p>{s}</p>
                </button>)
            }
            <div style={{ left: sliderWidth ? sliderLeft : "0%", width: sliderWidth === undefined ? "100%" : sliderWidth }} className="z-0 transition-all duration-300 absolute h-full top-0 ring-2 ring-[#13143b] bg-[#1b1d4c] rounded-full"></div>
        </div>
    );
}