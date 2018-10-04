const w = 800;
const h = 400;
const padding= 50;

xhr = new XMLHttpRequest();
xhr.open("GET", 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
xhr.send();
xhr.onload=function() {
	json=JSON.parse(xhr.responseText);
	let dataset = json;
	dataset.forEach((x) => {
		const parseTime = [];
		parseTime.push(Number(x.Time.split(":")[0]));
		parseTime.push(Number(x.Time.split(":")[1]));
		let date = new Date();
		date.setHours(0,parseTime[0],parseTime[1]);
		x.Time = date;
	})
	console.log(dataset);

	const xScale = d3.scaleTime()
		.domain([d3.min(dataset, (d) => new Date((d.Year - 1).toString())), d3.max(dataset, (d) => new Date((d.Year + 1).toString()))])
		.range([padding, w - padding]);

	const yScale = d3.scaleLinear()
		.domain([d3.min(dataset, (d) => d.Time), d3.max(dataset, (d) => d.Time)])
		.range([h - padding, padding]);

	const svg = d3.select("body")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

	svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("cx", (d) => xScale(new Date(d.Year.toString())))
		.attr("cy", (d) => yScale(d.Time))
		.attr("r", 5)
		.attr("fill", (d) => {
			if (d.Doping == "") {return "blue"}else{return "red"}
		})
		.attr("class", "dot")
		.attr("data-xvalue", (d) => new Date(d.Year.toString()))
		.attr("data-yvalue", (d) => d.Time)
		.style("opacity", 0.4)
		.on("mouseover", (d) => {
			const toolTip = document.querySelector("#tooltip");
			toolTip.style.display = "inline";
			toolTip.setAttribute("data-year", new Date(d.Year.toString()));
			let time;
			time = d.Time.getMinutes() + ":";
			if (d.Time.getSeconds() < 10) {time += "0"}
			time += d.Time.getSeconds();
			toolTip.innerHTML = "<p>" + d.Name + "</p>" + "<p>Time: " + time + "</p><p>" + d.Year + "</p><p style='text-align: right'>" + d.Doping + "</p>";
			console.log(toolTip.offsetHeight)
			toolTip.style.top = event.pageY - toolTip.offsetHeight - 10 + "px";
			toolTip.style.left = event.pageX - toolTip.offsetWidth/2 + "px";

		})
		.on("mouseout", (d) => {
			document.querySelector("#tooltip").style.display = "none";
		})

	const formatTime = d3.timeFormat("%M:%S");
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

	svg.append("g")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.attr("id", "x-axis")
		.call(xAxis);

	svg.append("g")
		.attr("transform", "translate(" + (padding) + ", 0)")
		.attr("id", "y-axis")
		.call(yAxis);
		
};
