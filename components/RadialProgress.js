import { Fragment, useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { completion } from "../recoil/app";
import * as d3 from "d3";
import { Typography } from "@mui/material";

const COLORS = [
  "rgba(113, 167, 214, 1)",
  "rgba(113, 167, 214, 0.85)",
  "rgba(113, 167, 214, 0.7)",
  "rgba(150, 94, 152, 1)",
  "rgba(150, 94, 152, 0.85)",
  "rgba(150, 94, 152, 0.7)",
  "rgba(150, 94, 152, 0.55)",
  "rgba(150, 94, 152, 0.4)",
];

const names = [
  "Challenge 3",
  "Challenge 2",
  "Challenge 1",
  "Annotation 5",
  "Annotation 4",
  "Annotation 3",
  "Annotation 2",
  "Annotation 1",
];

const RadialProgress = () => {
  const completed = useRecoilValue(completion);

  const svgRef = useRef(null);

  const piedata = useMemo(() => {
    return [
      "challenge3",
      "challenge2",
      "challenge1",
      "annotation5",
      "annotation4",
      "annotation3",
      "annotation2",
      "annotation1",
    ].map((k, i) => ({
      name: names[i],
      value: 1,
      completed: completed[k],
    }));
  }, [completed]);

  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    var width = 512,
      height = 512,
      radius = 250;

    var sa = (3 / 4) * Math.PI;

    var pie = d3
      .pie()
      .startAngle(2 * Math.PI + sa)
      .endAngle(sa)
      .padAngle(0.03)
      .value(function (d) {
        return d.value;
      });

    var arc = d3.arc().outerRadius(250).innerRadius(100);

    const svg = svgEl
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr(
        "transform",
        "translate(" + (width - radius) + "," + (height - radius) + ")"
      );

    var g = svg
      .selectAll(".arc")
      .data(pie(piedata))
      .enter()
      .append("g")
      .attr("class", "arc")
      .on("mousemove", function (e, d) {
        d3.select("#tooltip")
          .style("opacity", 1)
          .style("right", window.innerWidth - e.pageX + 1 + "px")
          .style("top", e.pageY + "px")
          .select("#value")
          .text(d.data.name);
      })
      .on("mouseout", function () {
        // Hide the tooltip
        d3.select("#tooltip").style("opacity", 0);
      });

    g.append("path")
      .attr("d", arc)
      .style("fill", function (d, i) {
        return COLORS[i];
      });

    g.append("g")
      .attr("transform", (d) => `translate(${arc.centroid(d)}) scale(0.25)`)
      .append("g")
      .attr("transform", "translate(-256,-256)")
      .html((d) => {
        return d3.select(`#meteo-icon-${d.data.completed ? 2 : 1} > g`).html();
      })
      .selectAll("path")
      .style("transform", "translate(25%, 25%) scale(0.5, 0.5)");
  });

  return (
    <Fragment>
      <div
        id="tooltip"
        style={{
          position: "absolute",
          zIndex: 1000,
          backgroundColor: "gray",
          color: "white",
          padding: 4,
          borderRadius: 4,
          pointerEvents: "none",
        }}
      >
        <Typography style={{ pointerEvents: "none" }} id="value"></Typography>
      </div>
      <div
        style={{
          position: "fixed",
          right: 5,
          top: "4.1em",
          width: "12vw",
          height: "12vw",
          zIndex: 1,
        }}
      >
        <div style={{ display: "none" }}>
          <svg
            id="meteo-icon-1"
            className="meteo-icon"
            width="24"
            height="24"
            viewBox="0 0 512 512"
          >
            <g style={{ pointerEvents: "none" }}>
              <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zm40-176c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z" />
            </g>
          </svg>

          <svg
            id="meteo-icon-2"
            className="meteo-icon"
            width="24"
            height="24"
            viewBox="0 0 512 512"
          >
            <g style={{ pointerEvents: "none" }}>
              <circle cx={256} cy={256} r={120} fill="white" />
              <path
                fill="green"
                d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
              />
            </g>
          </svg>
        </div>
        <svg ref={svgRef} viewBox="0 0 512 512" />
      </div>
    </Fragment>
  );
};

export default RadialProgress;
