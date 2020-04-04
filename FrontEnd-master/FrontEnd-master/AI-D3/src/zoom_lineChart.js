import React, { useRef, useEffect, useState } from "react";
import { select , line, curveCardinal, scaleLinear, axisBottom, axisRight, scaleBand, values, utcYears, scaleTime, extent, axisLeft, brushX, event, invert, zoom, zoomTransform } from "d3";
import usePrevious from "./usePrevious";

function Zoom({data, id = "myZoomableLineChart"}) {
  const svgRef = useRef();
  
  const [selection, setSelection] = useState([1951,1960]);
  const previousSelection = usePrevious(selection);
const [currentZoomState, setCurrentZoomState] = useState();

  
  useEffect(() => {
    const svg = select(svgRef.current);
  const svgContent = svg.select(".content")
   const yextent = extent(data, d=>d.value)
   const xextent = extent(data, d=>d.year)

   //const xscale =scaleLinear().domain(data.map((x) => x.year)).range([0,2000])
   const xscale =scaleLinear().domain(xextent).range([0,2000])
   
   if (currentZoomState) {
    const newXScale = currentZoomState.rescaleX(xscale);
    xscale.domain(newXScale.domain());
  }

   const yscale =scaleLinear().domain(yextent).range([500,0])
   

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

      
      svgContent
      .selectAll("path")
      .data([data])
      .join("path")
      .style("transform", "scale(1, -1)")
      .attr("d", myLine)
      .attr("stroke", "blue")
      .attr("fill", "none")
      
      

      svgContent
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "blue")
      .attr("r", (d) =>
        d.year >= selection[0] && d.year <= selection[1] ? 6 : 4
      )
      .attr("fill", (d) =>
        d.year >= selection[0] && d.year <= selection[1] ? "orange" : "yellow"
      )
      .attr("cx", (d) => xscale(d.year))
      .attr("cy", (d) => yscale(d.value))
      .on("mouseenter", (d) => {
        svg
          .selectAll(".tooltip")
          .data([d.value])
          .join(enter => enter.append("text").attr("y", yscale(d.value)))
          .attr("class", "tooltip")
          .text(d.value)
          .attr("x", xscale(d.year))
          .attr("text-anchor", "middle")
          .attr("y", yscale(d.value) - 8)
          .transition()
          .attr("opacity", 1)
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("height", d => 500 - yscale(d.value))

      
      
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
    

    const brush = brushX().extent([[0,0], [2000, 500]]).on("start brush end", () => {
      if (event.selection) {
        const indexSelection = event.selection.map(xscale.invert);
        setSelection(indexSelection);
      }

    //   const zoomBehavior =  
    //     zoom()
    //     .scaleExtent([0.5, 10])
    //     .translateExtent([
    //       [selection[0]],
    //       [selection[1]]
    //     ])
    //     .on("zoom", () => {
    //       const zoomState = zoomTransform(svg.node());
    //       setCurrentZoomState(zoomState);
    //     });
    //     svg.call(zoomBehavior);
    // })

    if (previousSelection === selection) {
      svg
        .select(".brush")
        .call(brush)
        .select(".brush").call(brush.move, null) 
        // .call(brush.move, selection.map(xscale)); 
    
    }
      }
        

  }, [data, selection, previousSelection, currentZoomState]);

  return (
      <React.Fragment>
    <svg ref = {svgRef} width={2000} height={500}>
    <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`}></g>
          <g className = "x-axis" ></g>
          <g className = "y-axis" ></g>
          <g className = "brush" clipPath={`url(#${id})`}></g>
        </svg>
       </React.Fragment> 
  );
}


export default Zoom