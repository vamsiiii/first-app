import React, { useRef, useEffect, useState } from "react";
import { select , line, curveCardinal, scaleLinear, axisBottom, axisRight, scaleBand, values, utcYears, scaleTime, extent, axisLeft, brushX, event, invert, zoom, zoomTransform } from "d3";
import usePrevious from "./usePrevious";

function Test_Zoom_Child(props) {
  const data = props.data;
  const svgRef = useRef();
  const svg = select(svgRef.current);
  const svgContent = svg.select(".content")
  const [currentZoomState, setCurrentZoomState] = useState();
  
  useEffect(() => {

   const yextent = extent(data, d=>d.value)
   const xextent = extent(data, d=>d.year)

   //const xscale =scaleLinear().domain(data.map((x) => x.year)).range([0,2000])
   var xscale =scaleLinear().domain(props.selection).range([0, props.width])
   var yscale =scaleLinear().domain(yextent).range([props.height,0])

  

   if (currentZoomState) {
    const newxscale = currentZoomState.rescaleX(xscale);
    xscale.domain(newxscale.domain())
  }
  
   
  //  if (!currentZoomState) {
  //   if (!idleTimeout) 
  //     return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
  //     xscale =scaleLinear().domain(xextent).range([0,2000])
  //  }
  //   else {
  //   xscale.domain([selection[0], selection[1]])
  //   console.log("New X Scale",xscale.domain())
  //   }
  

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
      .y(d => props.height - yscale(d.value))
    .curve(curveCardinal);
      
    svg
      .selectAll("path")
      .data([data])
      .join("path")
      .style("transform", "scale(1, -1)")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue")
      

      svg
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "blue")
      .attr("r", "4")
      .attr("fill", "yellow")
      .attr("cx", (d) => xscale(d.year))
      .attr("cy", (d) => yscale(d.value))
      .on("mouseenter", (d) => {
        svgContent
          .selectAll(".tooltip")
          .data([d.value])
          .join(enter => enter.append("text").attr("y", yscale(d.value)))
          .attr("class", "tooltip")
          .text(d.value)
          .attr("x", xscale(d.year))
          .attr("text-anchor", "middle")
          .attr("y", yscale(d.value)-10)
          .transition()
          .attr("opacity", 1)
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("height", d => props.height - yscale(d.value))

    
     
   
      const zoomBehavior = zoom()
      .scaleExtent([1, 10])
      .translateExtent([
        [0, 0],
        [props.width, props.height]
      ])
      .on("zoom", () => {
        // My Current Zoom State
    
        const zoomState = zoomTransform(svgRef.current);
        console.log("Current Zoom State", zoomState)
        setCurrentZoomState(zoomState);
        

      });
      
    svg.call(zoomBehavior)
      

  }, [data, props.selection, currentZoomState]);

  if (!props.selection) {
    return null;
  }

  return (
      <React.Fragment>
    <svg ref = {svgRef} width={props.width} height={props.height}>
    <defs>
            <clipPath id="myClipPath">
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath="url(#myClipPath)"></g>
          <g className = "x-axis"></g>
          <g className = "y-axis"></g>
          <g className = "brush"></g>
        </svg>
       </React.Fragment>
  );

}

export default Test_Zoom_Child;