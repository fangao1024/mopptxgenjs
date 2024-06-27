import React from "react";
import pptxgen from "pptxgenjs"; // react-app webpack will use package.json `"module": "dist/pptxgen.es.js"` value
import { testMainMethods, testTableMethod } from "./tstest/Test";
import logo from "./logo.png";
import "./App.css";

function extractFunctionBody(fn) {
	const fnStr = fn.toString(); // 将函数转换为字符串
	const bodyMatch = fnStr.match(/^[^{]*{\s*([\s\S]*)\s*}$/); // 使用正则表达式匹配函数体

	if (bodyMatch && bodyMatch.length > 1) {
		return bodyMatch[1]; // 返回匹配到的函数体
	} else {
		throw new Error('无法提取函数体');
	}
}

function App() {
	const runDemo = () => {
		let pptx = new pptxgen();

		pptx.theme = {
			clrSchemeColor: {
				accent1: "a6e22e",
			},
		};

		let slide = pptx.addSlide();

		let dataChartRadar = [
			{
				name: "Region 1",
				labels: ["May", "June", "July", "August", "September"],
				values: [26, 53, 100, 75, 41],
			},
		];
		//slide.addChart(pptx.ChartType.radar, dataChartRadar, { x: 0.36, y: 2.25, w: 4.0, h: 4.0, radarStyle: "standard" });

		//slide.addShape(pptx.ShapeType.rect, { x: 4.36, y: 2.36, w: 5, h: 2.5, fill: pptx.SchemeColor.background2 });

		//slide.addText("React Demo!", { x: 1, y: 1, w: "80%", h: 1, fontSize: 36, fill: "eeeeee", align: "center" });
		slide.addText("React Demo! \n text", {
			x: 1,
			y: 0.5,
			w: "80%",
			h: 1,
			fontSize: 36,
			align: "center",
			color: "accent1",
		});

		slide.addChart(pptx.ChartType.radar, dataChartRadar, { x: 1, y: 1.9, w: 8, h: 3 });

		slide.addText(`PpptxGenJS version: ${pptx.version}`, {
			x: 0,
			y: 5.3,
			w: "100%",
			h: 0.33,
			fontSize: 10,
			align: "center",
			fill: "E1E1E1", //{ color: pptx.SchemeColor.background2 },
			color: "A1A1A1", // pptx.SchemeColor.accent3,
		});
		slide.addImage({
			x: 0.5,
			y: 0.5,
			w: 2,
			h: 2,
			path: 'https://ppt-qn.molishe.com/zhangweipeng/test/1719296183220/ppt/media/image1.png?imageView2/0/w/1920/h/1080',
			clipShape: {
				name: 'star5',
				adjusting: {
					adj: 30111,
					hf: 105146,
					vf: 110557,
				},
			}
		})

		pptx.writeFile({ fileName: "pptxgenjs-demo-react.pptx" });
	}

	return (
		<section>
			<nav className="navbar navbar-expand-lg navbar-dark bg-primary py-2">
				<div className="container-fluid">
					<a className="navbar-brand" href="https://gitbrent.github.io/PptxGenJS/">
						<img src={logo} alt="logo" width="32" height="32" className="d-inline-block align-text-center me-2" />
						PptxGenJS
					</a>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarText"
						aria-controls="navbarText"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarText">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<a className="nav-link active" aria-current="page" href="https://gitbrent.github.io/PptxGenJS/demo/react/">
									React Demo Home
								</a>
							</li>
						</ul>
						<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
							<li className="nav-item me-3">
								<a className="nav-link" href="https://gitbrent.github.io/PptxGenJS/demos/">
									Library Demos
								</a>
							</li>
							<li className="nav-item me-3">
								<a className="nav-link" href="https://gitbrent.github.io/PptxGenJS/docs/installation/">
									API Documentation
								</a>
							</li>
							<li className="nav-item me-3">
								<a className="nav-link" href="https://github.com/gitbrent/PptxGenJS/">
									GitHub Project
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>

			<main className="container">
				<div className="jumbotron my-5">
					<h1 className="display-4">React Demo</h1>
					<p className="lead">Sample React application to demonstrate using the PptxGenJS library as a module.</p>
					<hr className="my-4" />

					<h5 className="text-info">Demo Code (.tsx)</h5>
					<pre className="my-4">
						<code className="language-javascript">{extractFunctionBody(runDemo)}</code>
					</pre>

					<div className="row row-cols-1 row-cols-md-3 g-4">
						<div className="col">
							<button type="button" className="btn btn-success w-100 me-3" onClick={(_ev) => runDemo()}>
								Run Demo
							</button>
						</div>
						<div className="col">
							<button type="button" className="btn btn-primary w-100" onClick={(_ev) => testMainMethods()}>
								Run Std Tests
							</button>
						</div>
						<div className="col">
							<button type="button" className="btn btn-primary w-100" onClick={(_ev) => testTableMethod()}>
								Run HTML2PPT Test
							</button>
						</div>
					</div>

					<table id="html2ppt" className="table table-dark" style={{ display: "none" }}>
						<thead className="table-dark">
							<tr>
								<th>col 1</th>
								<th>col 2</th>
								<th>col 3</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>cell 1</td>
								<td>cell 2</td>
								<td>cell 3</td>
							</tr>
						</tbody>
					</table>
				</div>
			</main>
		</section>
	);
}

export default App;
