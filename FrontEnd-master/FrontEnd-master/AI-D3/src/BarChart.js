import React , {useRef, useEffect, useState} from "react";
import { select , line, curveCardinal, scaleLinear, axisBottom, axisRight, scaleBand, values, utcYears, scaleTime, extent, axisLeft, brushX, event, invert} from "d3";
import usePrevious from "./usePrevious";

// const useResizeObserver = ref => {
//   const [dimensions, setdimensions] = useState(null)
//   useEffect(() => {
//     const observeTarget = ref.current
//     const resizeObserver = new ResizeObserver(entries => {
//       entries.forEach(entry => {
//         setdimensions(entry.contentRect)
//       })
//     })
//     resizeObserver.observe(observeTarget)
//     return() => {
//       resizeObserver.unobserve(observeTarget)
//     }
//   }, [ref])
//    return dimensions;
// }


function Chart({data}) {
  const svgRef = useRef();
//   const wrapperRef = useRef();
//   const dimensions = useResizeObserver(wrapperRef)

const [selection, setSelection] = useState([0, 1.5]);
const previousSelection = usePrevious(selection);

  useEffect(() => {

    // if (!dimensions) return;
    const yextent = extent(data, d=>d.value)

   const svg = select(svgRef.current);
   const xscale =scaleBand().domain(data.map((x) => x.year)).range([0,2000]).padding(0.1)
   const yscale =scaleLinear().domain(yextent).range([500,0])
   const colorscale =scaleLinear().domain(yextent).range(["green", "orange", "red"]).clamp(true)
  
   
   const xaxis = axisBottom(xscale)
   .ticks(data.length)

   svg
   .select(".x-axis")
   .style("transform", `translateY(500px)`)
   .call(xaxis)

   const yaxis = axisRight(yscale);
   svg
   .select(".y-axis")
   .style("transform", `translateX(2000px)`)
   .call(yaxis)

   console.log(xscale(data.map((x) => x.year)).invert(2000))

  /////////// CIRCLE /////////////

  //  svg
  //  .selectAll("circle")
  //  .data(data)
  //  .join("circle")
  //  .attr("r", value => value)
  //  .attr("cx", value => value)
  //  .attr("cy", value => value)
  //  .attr("stroke", "red")

  /////////// LINE ///////////////

  // const xscale =scaleLinear().domain([0,data.length - 1]).range([0,800])
  // const yscale =scaleLinear().domain([0,90]).range([500,0])

  // const myLine = line()
  //  .x((value,index) => xscale(index))
  //  .y(yscale) 
  //  .curve(curveCardinal)
  // svg
  // .selectAll(".line")
  // .data([data])
  // .join("path")
  // .attr("class", "line")
  // .attr("d", myLine)
  // .attr("fill", "none")
  // .attr("stroke", "blue")


  ////////////  BAR CHART  //////////////

  svg
  .selectAll(".bar")
  .data(data)
  .join("rect")
  .attr("class", "bar")
  .style("transform", "scale(1, -1)")
  .attr("x", d => xscale(d.year))
  .attr("y", -500)
  .attr("width", xscale.bandwidth())
  .on("mouseenter", (d) => {
    svg
      .selectAll(".tooltip")
      .data([d.value])
      .join(enter => enter.append("text").attr("y", yscale(d.value)))
      .attr("class", "tooltip")
      .text(d.value)
      .attr("x", xscale(d.year) + xscale.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .transition()
      .attr("y", yscale(d.value) - 4)
      .attr("opacity", 1);
  })
  .on("mouseleave", () => svg.select(".tooltip").remove())
  .transition()
  .attr("height", d => 500 - yscale(d.value))
  .attr("fill", d => colorscale(d.value))

  const brush = brushX().extent([0,0], [2000, 500]).on("start brush end", () => {
    if (event.selection) {
      const indexSelection = event.selection.map(xscale.invert());
      setSelection(indexSelection);
    }
  })

  if (previousSelection === selection) {
    svg.select(".brush")
      .call(brush)
      .call(brush.move, selection.map(xscale))
  }
  
  }, [data, selection, previousSelection]);
    
      return (
        // <div ref = {wrapperRef}>()
        <svg ref = {svgRef} width={2000} height={500}>
          <g className = "x-axis"></g>
          <g className = "y-axis"></g>
          <g className = "brush"></g>
        </svg>
        // </div>
      )
}

export default Chart;
