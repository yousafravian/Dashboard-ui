import {Component, ElementRef, Input, OnInit} from "@angular/core";

declare var d3: any;

interface LineChartModel {
  label: string;
  data: any[];
  color: string;
  legend: string;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @Input() data: LineChartModel[] = [];
  @Input() xLabels: string[] = [];
  @Input() addLegend: boolean = false;
  @Input() showDots: boolean = false;
  @Input("dateFormat") format = "%Y";
  private dataAdaptedToD3Js: any[] = [];
  public svg: any;
  public domainMaxRange: number = 0;
  public domainMinRange: number = 0;
  public dateFormat: Function;

  constructor(public chartElem: ElementRef) {
    this.dateFormat = d3.timeFormat(this.format);
  }

  ngOnInit(): void {
    if (this.data.length < 10) {
      this.xLabels = this.covertToDate(this.xLabels);

      this.data[0].data.forEach((element, index) => {
        let objectAdapted = {label: this.xLabels[index]};
        for (let i = 0; i < this.data.length; i++) {
          // @ts-ignore
          objectAdapted[this.data[i].label] = this.data[i].data[index];
          if (this.domainMaxRange < this.data[i].data[index]) {
            this.domainMaxRange = this.data[i].data[index];
          }
          if (this.domainMinRange > this.data[i].data[index]) {
            this.domainMinRange = this.data[i].data[index];
          }
        }
        this.dataAdaptedToD3Js.push(objectAdapted);
      });

      this.draw();
    }
  }

  covertToDate(array: any[]) {
    array = array.map(element => {
      let date = new Date(element);
      return date;
    });
    return array;
  }

  draw() {
    // set the dimensions and margins of the graph
    let margin = {top: 12, right: 100, bottom: 30, left: 30},
      width = 1060 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3
      .select("#my_dataviz")
      .append("svg")
      //.attr("width", width + margin.left + margin.right)
      //.attr("height", height + margin.top + margin.bottom)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height +
        margin.top +
        margin.bottom}`
      )
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // A color scale: one color for each group
    let myColor = {};
    // List of groups (here I have one group per column)
    let allGroup = [];
    for (let i = 0; i < this.data.length; i++) {
      allGroup.push(this.data[i].label);
      // @ts-ignore
      myColor[this.data[i].label] = this.data[i].color;
    }

    // Reformat the data: we need an array of arrays of {x, y} tuples
    let dataReady = allGroup.map(grpName => {
      this.dataAdaptedToD3Js.forEach(d => {
        return {label: this.dateFormat(d.label), value: +d[grpName]};
      });
      // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: this.dataAdaptedToD3Js.map(d => {
          return {label: this.dateFormat(d.label), value: +d[grpName]};
        })
      };
    });

    let x = d3
      .scaleTime()
      .domain(
        d3.extent(this.dataAdaptedToD3Js, (d: { label: any; }) => {
          return this.dateFormat(d.label);
        })
      )
      .rangeRound([0, width]);

    const xaxis = d3.axisBottom(x).tickFormat(d3.format("0"));
    //.scale(x);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xaxis);

    // Add Y axis
    this.domainMinRange =
      this.domainMinRange == 0 ? 0 : this.domainMinRange + -5;

    let y = d3
      .scaleLinear()
      .domain([
        this.domainMinRange,
        Math.abs(
          this.domainMaxRange + (this.domainMaxRange * 0, 2) + this.data.length
        )
      ])
      .range([height, 0]);
    const yaxis = d3.axisLeft(y);
    svg.append("g").call(yaxis);

    // Define the X grid lines
    function make_x_gridlines() {
      return d3.axisBottom(x).ticks(9);
    }

    // Define the Y grid lines
    function make_y_gridlines() {
      return d3.axisLeft(y).ticks(9);
    }

    // Add the X grid lines
    // svg
    //   .append("g")
    //   .attr("class", "grid")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(make_x_gridlines()
    //     .tickSize(-height)
    //     .tickFormat("")
    //   );

    // Add the Y grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
      );

    // Add the lines
    let line = d3
      .line()
      .x((d: { [x: string]: any; }) => {
        return x(d["label"]);
      })
      .y(function (d: { [x: string]: string | number; }) {
        return y(+d["value"]);
      });
    svg
      .selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("class", (d: { name: any; }) => {
        return d.name;
      })
      .attr("d", (d: any) => {
        return line(d.values);
      })
      .attr("stroke", (d: { name: string | number; }) => {
        // @ts-ignore
        return myColor[d.name];
      })
      .style("stroke-width", 7)
      .style("fill", "none");

    // create a tooltip
    let Tooltip = d3
      .select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");
    if (this.showDots) {
      svg
        // First we need to enter in a group
        .selectAll("myDots")
        .data(dataReady)
        .enter()
        .append("g")
        .style("fill", (d: { name: string | number; }) => {
          // @ts-ignore
          return myColor[d.name];
        })
        .attr("class", (d: { name: any; }) => {
          return d.name;
        })
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(dataReady)
        .data((d: any[]) => {
          return d.values;
        })
        .attr("class", "myCircle")
        .enter()
        .append("circle")
        .attr("cx", (d: { label: any; }) => {
          return x(d.label);
        })
        .attr("cy", (d: { value: any; }) => {
          return y(d.value);
        })
        .attr("r", 3)
        .attr("stroke", "white");
      //.on("mousemove", d => {
      // console.log("achraf", d.label);
      // });
    }

    svg
      .selectAll("myLabels")
      .data(dataReady)
      .enter()
      .append("g")
      .append("text")
      .attr("class", (d: { name: any; }) => {
        return d.name;
      })
      .datum((d: { name: any; values: string | any[]; }) => {
        return {name: d.name, value: d.values[d.values.length - 1]};
      }) // keep only the last value of each time series
      .attr("transform", (d: { value: { label: any; value: any; }; }) => {
        return "translate(" + x(d.value.label) + "," + y(d.value.value) + ")";
      }) // Put the text at the position of the last point
      .attr("x", 12) // shift the text a bit more right
      .style("fill", (d: { name: string | number; }) => {
        // @ts-ignore
        return myColor[d.name];
      })
      .style("font-size", 15);

    // Add a legend (interactive)
    let cy = 30;
    let ty = 33;
    if (this.addLegend) {
      this.data.forEach(element => {
        svg
          .append("circle")
          .attr("cx", 30)
          .attr("cy", cy)
          .style("cursor", "pointer")
          .attr("r", 6)
          .style("fill", element.color)
          .on("click", (d: any) => {
            let currentOpacity: any = d3
              .selectAll("." + element.label)
              .style("opacity");
            d3.selectAll("." + element.label).style(
              "opacity",
              currentOpacity == 1 ? 0 : 1
            );
          });
        svg
          .append("text")
          .attr("x", 40)
          .attr("y", ty)
          .text(element.legend)
          .style("font-size", "16px")
          .style("cursor", "pointer")
          .style("fill", element.color)
          .attr("alignment-baseline", "middle")
          .on("click", (d: any) => {
            let currentOpacity: any = d3
              .selectAll("." + element.label)
              .style("opacity");
            d3.selectAll("." + element.label).style(
              "opacity",
              currentOpacity == 1 ? 0 : 1
            );
          });
        cy = cy + 20;
        ty = ty + 20;
      });
    }
    d3.selectAll(".tick text").style("font-size", "14px");
  }
}
