import React, { useRef, useEffect } from "react";
import { select , line, curveCardinal, scaleLinear, axisBottom, axisRight, scaleBand, values, utcYears, scaleTime, extent, axisLeft, brushX, event, invert } from "d3";


function lineChild({data, selection}){
  const svgRef = useRef();

  console.log(data)

  useEffect(() => {
   const svg = select(svgRef.current);
   const svgContent = svg.select(".content");
   const yextent = extent(data, d=>d.value)
   const xextent = extent(data, d=>d.year)

   //const xscale =scaleLinear().domain(data.map((x) => x.year)).range([0,2000])
   const xscale =scaleLinear().domain(selection).range([10,1990])
   const yscale =scaleLinear().domain(yextent).range([490,10])
   
   

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
      .attr("fill", "none")
      .attr("stroke", "blue");

      svgContent
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", (d) => d.year 
      )
      .attr("fill", "orange"
      )
      .attr("cx", (d) => xscale(d.year))
      .attr("cy", (d) => yscale(d.value));
      
      

  }, [data, selection]);

  if (!selection) {
    return null;
  }

  return (
    <svg ref = {svgRef} width={2000} height={500}>
    {/* <defs>
            <clipPath id="myClipPath">
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath="url(#myClipPath)"></g> */}
          <g className = "x-axis"></g>
          <g className = "y-axis"></g>
        </svg>
  );
}

export default lineChild;
