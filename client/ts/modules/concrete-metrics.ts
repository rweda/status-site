import { Metric, MetricType, DataPoint } from "./abstract-metric";
import { Utility } from "./utility";
import "flot";
import "../vendor/jquery.flot.threshold.js";
import "../vendor/jquery.flot.tooltip.js";

type JsonCpuLoadDataPoint = {
	Timestamp: string;
	Value: number;
}


/**
 * Data type representing CPU Load data point
 * 
 * @export
 * @class CpuLoadDataPoint
 * @extends {DataPoint}
 */
export class CpuLoadDataPoint extends DataPoint {

	/**
	 * Value of load of CPU 0-100 percents
	 * 
	 * @type {number}
	 * @memberOf CpuLoadDataPoint
	 */
	public value: number;


	/**
	 * Creates an instance of CpuLoadDataPoint.
	 * @param {JsonCpuLoadDataPoint} json - JSON object representing CPU Load data point
	 * 
	 * @memberOf CpuLoadDataPoint
	 */
	constructor(json: JsonCpuLoadDataPoint) {
		super();

		this.timestamp = Utility.toDate(json.Timestamp);
		this.value = json.Value;
	}
}


/**
 * Class responsible for manipulating and rendering CPU Load metric
 * 
 * @export
 * @class CpuLoadMetric
 * @extends {Metric<CpuLoadDataPoint>}
 */
export class CpuLoadMetric extends Metric<CpuLoadDataPoint> {


	/**
	 * Creates an instance of CpuLoadMetric.
	 * @param {string} source - source of the metric
	 * 
	 * @memberOf CpuLoadMetric
	 */
	constructor(source: string) {
		super(source);
		
		this._metricType = MetricType.CpuLoad;
	}


	/**
	 * 
	 * 
	 * @protected
	 * 
	 * @memberOf CpuLoadMetric
	 */
	protected renderPlot(): void {
		var data = [];
		this
			.data
			.sort(dp => dp.timestamp.getMilliseconds())
			.reverse()
			.forEach((value, index, array) => data.push([index, value.value]));

		let plotOptions: any = {
			yaxis: {
				max: 100,
				min: 0
			},
			xaxis: {
				tickDecimals: 0,
				ticks: false
			},
			grid: {
				borderWidth: 0,
				labelMargin: 10,
				hoverable: true,
				clickable: true,
				mouseActiveRadius: 6
			},
			tooltip: {
				show: true,
				content: "Load %y%",
				defaultTheme: false,
				cssClass: "flot-tooltip"
			}
		};

		$.plot(
			$(`[data-identifier="${this.getMetricIdentifier()}"] .metric-chart`),
			[
				{
					data: data,
					lines: {
						show: true,
						fill: 0.50
					},
					color: 'rgb(200, 20, 30)',
					threshold: {
						below: 90,
						color: "#FFC107"
					}
				}
			],
			plotOptions
		);
	}

	/**
	 * 
	 * 
	 * @protected
	 * @param {*} json 
	 * @returns {CpuLoadDataPoint} 
	 * 
	 * @memberOf CpuLoadMetric
	 */
	protected getDataPointFromJson(json: any): CpuLoadDataPoint {
		return new CpuLoadDataPoint(json);
	}
}
