import React, { useRef, useEffect, useState } from "react";
import { select , line, curveCardinal, scaleLinear, axisBottom, axisRight, scaleBand, values, utcYears, scaleTime, extent, axisLeft, brushX, event, invert, zoom, zoomTransform } from "d3";
import usePrevious from "./usePrevious";

function App({data, children, id = "myZoomableLineChart"}) {
  const svgRef = useRef();
  const [selection, setSelection] = useState([0, 3]);
const previousSelection = usePrevious(selection);

const [currentZoomState, setCurrentZoomState] = useState();

  
  useEffect(() => {

   const yextent = extent(data, d=>d.value)
   const xextent = extent(data, d=>d.year)

   //const xscale =scaleLinear().domain(data.map((x) => x.year)).range([0,2000])
   const xscale =scaleLinear().domain(xextent).range([0,2000])
   const yscale =scaleLinear().domain(yextent).range([500,0])
   const svg = select(svgRef.current);

   const xaxis = axisBottom(xscale).ticks(data.length)

   svg
   .select(".x-axis")
   .style("transform", `translateY(500px)`)
   .call(xaxis)

   const yaxis = axisRight(yscale);
   svg
   .select(".y-axis")
   .style("transform", `translateX(2000px)`)
   .call(yaxis)

    const myLine = line()
      .x(d => xscale(d.year))
      .y(d => 500 - yscale(d.value))
      .curve(curveCardinal);
    svg
      .selectAll("path")
      .data([data])
      .join("path")
      .style("transform", "scale(1, -1)")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue");

      svg
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", (d) =>
        d.year >= selection[0] && d.year <= selection[1] ? 4 : 2
      )
      .attr("fill", (d) =>
        d.year >= selection[0] && d.year <= selection[1] ? "orange" : "yellow"
      )
      .attr("cx", (d) => xscale(d.year))
      .attr("cy", (d) => yscale(d.value));

      if (currentZoomState) {
        const newXScale = currentZoomState.rescaleX(xscale);
        xscale.domain(newXScale.domain());
      }
      
      const brush = brushX().extent([[0,0], [2000, 500]]).on("start brush end", () => {
        if (event.selection) {
          const indexSelection = event.selection.map(xscale.invert);
          setSelection(indexSelection);
        }
      })

      if (previousSelection === selection) {
        svg
          .select(".brush")
          .call(brush)
          .call(brush.move, selection.map(xscale));
      }

      const zoomBehavior = zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [0, 0],
        [2000, 500]
      ])
      .on("zoom", () => {
        const zoomState = zoomTransform(svg.node());
        setCurrentZoomState(zoomState);
      });

    svg.call(zoomBehavior);

  }, [data, selection, previousSelection, currentZoomState]);

  return (
      <React.Fragment>
    <svg ref = {svgRef} width={2000} height={500}>
          <g className = "x-axis"></g>
          <g className = "y-axis"></g>
          <g className = "brush"></g>
        </svg>
        {children(selection)}
       </React.Fragment> 
  );
}

export default App;